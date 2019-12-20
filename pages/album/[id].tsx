import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { SimpleImg } from 'react-simple-img';

import { fetchMusic, artworkForMediaItem } from '~/utils';
import { AlbumResponse } from '~/@types/MusicKit/album';

const generateSrcSet = (artworkURL: string | undefined, sizes: number[]) =>
  sizes.map(size => `${artworkForMediaItem(artworkURL, size)} ${size}w`).join();

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
    <>
      <div
        css={`
          margin: 2rem;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-gap: 2rem;

          h2 {
            color: var(--primary);
          }
        `}
      >
        <SimpleImg
          placeholder={artworkForMediaItem(undefined, 600)}
          src={artworkForMediaItem(album.attributes?.artwork?.url, 400)}
          alt={album.attributes?.name}
          srcSet={srcSet}
          style={{ width: 200, height: 200, borderRadius: 4 }}
        />
        <div>
          <h1>{album.attributes?.name}</h1>
          <h2>{album.attributes?.artistName}</h2>
        </div>
      </div>
      <ol
        css={`
          font-size: 1.6rem;
          list-style: none;
          counter-reset: my-awesome-counter;
          padding: 0 2rem;

          li {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            border-top: 1px solid rgba(0, 0, 0, 0.37);
            border-bottom: 1px solid rgba(0, 0, 0, 0.37);
            padding: 0 1rem;
          }

          li::before {
            counter-increment: my-awesome-counter;
            content: counter(my-awesome-counter);
            color: rgba(0, 0, 0, 0.37);
            padding-right: 1.5rem;
          }
        `}
      >
        {album.relationships?.tracks?.data?.map(track => (
          <li key={track.id}>
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
              `}
            >
              <span>{track.attributes?.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </>
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
    `/v1/me/library/albums/${query.id}?include=tracks,genres`,
    devToken,
    userToken
  );

  return { initialData, devToken, userToken };
};

export default AlbumPage;
