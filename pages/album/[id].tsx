import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { SimpleImg } from 'react-simple-img';
import { ellipsis } from 'polished';

import { fetchMusic, artworkForMediaItem } from '~/utils';
import { AlbumResponse, TracksDatum } from '~/@types/MusicKit/album';
import { DEFAULT_ALBUM_ART } from '~/config';

const generateSrcSet = (artworkURL: string | undefined, sizes: number[]) =>
  sizes.map(size => `${artworkForMediaItem(artworkURL, size)} ${size}w`).join();

function msToTime(duration: number) {
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (hours && minutes) {
    const hourText = hours === 1 ? 'hour' : 'hours';
    const minuteText = hours === 1 ? 'minute' : 'minutes';
    return `${hours} ${hourText}, ${minutes} ${minuteText}`;
  }

  const minuteText = hours === 1 ? 'hour' : 'hours';
  return `${minutes} ${minuteText}`;
}

const getAlbumDuration = (tracks: TracksDatum[]) => {
  const durationInMilliseconds = tracks.reduce((acc, cur) => {
    const duration = cur?.attributes?.durationInMillis ?? 0;
    return acc + duration;
  }, 0);

  return msToTime(durationInMilliseconds);
};

const AlbumPage: NextPage<{
  devToken: string;
  userToken: string;
  initialData: AlbumResponse;
}> = ({ devToken, userToken, initialData }) => {
  const { query } = useRouter();
  const { data, error } = useSWR<AlbumResponse>(
    [`/v1/me/library/albums/${query.id}`, devToken, userToken],
    fetchMusic,
    { initialData }
  );

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const album = data?.data && data.data[0];

  if (!album) return <pre>welp</pre>;

  const sizes = [50, 100, 200, 400];

  const srcSet = generateSrcSet(album.attributes?.artwork?.url, sizes);

  return (
    <div
      css={`
        @media (min-width: 500px) {
          display: grid;
          grid-template-columns: 260px 1fr;
        }
      `}
    >
      <div
        css={`
          display: none;
          @media (min-width: 500px) {
            display: block;
          }
        `}
      >
        <h1>Guacamole</h1>
      </div>
      <div>
        <div
          css={`
            margin: 2rem;
            @media (min-width: 500px) {
              display: grid;
              grid-template-columns: 30rem 1fr;
              grid-gap: 2rem;
            }
          `}
        >
          <div
            css={`
              width: 100%;
              border-radius: 0.4rem;
              margin: 0 auto 2rem;
              overflow: hidden;
            `}
          >
            <SimpleImg
              height={200}
              width={200}
              placeholder={DEFAULT_ALBUM_ART}
              src={artworkForMediaItem(album.attributes?.artwork?.url, 400)}
              alt={album.attributes?.name}
              srcSet={srcSet}
              applyAspectRatio
            />
          </div>
          <div
            css={`
              h1 {
                font-size: 2.4rem;
                font-weight: 600;
              }
              h2 {
                font-size: 2.4rem;
                font-weight: 400;
                color: var(--primary);
              }
            `}
          >
            <h1>{album.attributes?.name}</h1>
            <h2>{album.attributes?.artistName}</h2>
          </div>
        </div>
        <div
          css={`
            padding: 0 2rem;
            margin-bottom: 2rem;
          `}
        >
          <ol
            css={`
              font-size: 1.6rem;
              list-style: none;
              padding: 0;
              margin-bottom: 2rem;

              li {
                display: grid;
                grid-template-columns: auto 1fr;
                align-items: center;
                border-top: 1px solid rgba(0, 0, 0, 0.37);
                padding: 0 1rem;
                :last-of-type {
                  border-bottom: 1px solid rgba(0, 0, 0, 0.37);
                }
              }
            `}
          >
            {album.relationships?.tracks?.data?.map(track => (
              <li
                key={track.id}
                css={`
                ::before {
                  content: "${track.attributes?.trackNumber}";
                  color: rgba(0, 0, 0, 0.37);
                  padding-right: 1.5rem;
                }
              `}
              >
                <button
                  onClick={async () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    const music = window.MusicKit.getInstance();
                    await music.setQueue({ song: track.id });
                    await music.play();
                  }}
                  type="button"
                  css={`
                    width: 100%;
                    background: none;
                    border: none;
                    padding: 1.2rem 0;
                    text-align: left;
                    ${ellipsis('100%')}
                  `}
                >
                  <span>{track.attributes?.name}</span>
                </button>
              </li>
            ))}
          </ol>

          {album.relationships?.tracks?.data &&
            album.relationships?.tracks?.data.length > 0 && (
              <p
                css={`
                  font-size: 1.6rem;
                  color: rgba(0, 0, 0, 0.37);
                `}
              >
                {album.attributes?.trackCount} song
                {album.attributes?.trackCount &&
                album.attributes?.trackCount === 1
                  ? ''
                  : 's'}
                , {getAlbumDuration(album.relationships?.tracks?.data)}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

AlbumPage.getInitialProps = async context => {
  const { query, req, res } = context;

  const { getBaseURL } = await import('@mcansh/next-now-base-url');
  const { parseCookies } = await import('nookies');
  const { redirect } = await import('~/utils/redirect');
  // 1. get the base url from either x-forwarded headers (now) or host
  const base = getBaseURL(req);
  // 2. get a developer jwt token
  const devTokenPromise = await fetch(`${base}/api/token`);
  const devTokenData = await devTokenPromise.json();
  const devToken = devTokenData.token;
  // 3. parse cookies to get the userToken
  const cookies = parseCookies(context);
  const { userToken } = cookies;
  // 3a. if no user token, redirect to login page
  if (!userToken) {
    redirect(res, 302, '/login');
    return { initialData: {}, devToken: '', userToken: '' };
  }
  // 5. fetch the current user's recently added music
  const initialData = await fetchMusic(
    `/v1/me/library/albums/${query.id}?include=tracks`,
    devToken,
    userToken
  );

  return { initialData, devToken, userToken };
};

export default AlbumPage;
