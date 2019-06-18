import React from 'react';
import { ellipsis } from 'polished';
import { NextPage } from 'next';
import { parseCookies } from 'nookies';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import ms from 'ms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRandom } from '@fortawesome/free-solid-svg-icons';

import { Album as AlbumType, Track } from '~/types';
import { ShuffleModeSongs, redirect, getHost, fetchMusic } from '~/utils';

function fmtMSS(input: number) {
  const minutes = Math.floor(input / 60);
  const seconds = String(input - minutes * 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const AlbumPage = styled.div`
  padding-top: 1rem;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  header {
    display: flex;

    img {
      display: block;
      width: 150px;
      height: 150px;
      object-fit: contain;
      margin-right: 1rem;
      border-radius: 0.8vw;
    }

    h1 {
      margin-bottom: 1rem;
    }
  }

  ol {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      font-size: 1.6rem;
      display: flex;
      align-items: center;

      button {
        border: none;
        border-bottom: 1px solid #494949;
        ${ellipsis('90%')};
        display: flex;
        align-items: center;
        flex-grow: 1;
        padding: 1.6rem 0;
        background: none;
        cursor: pointer;

        &::after {
          content: attr(data-explicit);
          display: inline-flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 1.4rem;
          height: 1.4rem;
          font-size: 1rem;
          border-radius: 2px;
          line-height: 1;
          margin-left: 0.5rem;
          background: #a8a8a8;
          color: white;
        }
      }

      &::before {
        display: inline-block;
        width: 2rem;
        text-align: center;
        content: attr(data-track);
        margin-right: 0.5rem;
      }
    }
  }
`;

interface Props {
  album: AlbumType;
  token: string;
  musicUserToken: string;
  MusicKit: any;
}

// @ts-ignore
const Album: NextPage<Props> = ({ album, MusicKit }: Props) => {
  const albumDuration = album.data.relationships.tracks.data.reduce(
    (acc, cur) => acc + cur.attributes.durationInMillis,
    0
  );
  const music = MusicKit.getInstance();

  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    const playbackTimeDidChange = (data: any) => {
      setTime(data.currentPlaybackTime);
      setDuration(data.currentPlaybackDuration);
    };
    if (music) {
      music.addEventListener(
        MusicKit.Events.playbackTimeDidChange,
        playbackTimeDidChange
      );
    }

    return () => {
      if (music) {
        music.removeEventListener(
          MusicKit.Events.playbackTimeDidChange,
          playbackTimeDidChange
        );
      }
    };
  });

  const playSong = async (track: Track) => {
    if (
      !track ||
      !track.attributes ||
      !track.attributes.playParams ||
      !track.attributes.playParams.catalogId
    ) {
      console.error('no catalog id');
    }
    await music.setQueue({
      song: track.attributes.playParams.catalogId,
    });
    await music.play();
  };

  const playAlbum = async () => {
    await album.data.relationships.tracks.data.forEach(async track => {
      await music.setQueue({ song: track.attributes.playParams.catalogId });
    });
    await music.play();
  };

  const playShuffledAlbum = async () => {
    music.player.shuffleMode = ShuffleModeSongs;
    await playAlbum();
  };

  return (
    <AlbumPage>
      <header>
        <p data-apple-music-now-playing></p>
        <img
          src={album.data.attributes.artwork.url.replace(/{w}|{h}/g, '600')}
          alt={album.data.attributes.name}
        />
        <div>
          <h1>{album.data.attributes.name}</h1>
          <h2>{album.data.attributes.artistName}</h2>
          <div
            css={`
              margin-top: 2rem;

              button {
                background: #a550a7;
                border: none;
                padding: 0.5rem 2rem;
                margin: 0;
                color: white;
                border-radius: 4px;
                line-height: 1;
                cursor: pointer;
                &:first-of-type {
                  margin-right: 1rem;
                }

                svg {
                  width: 1.25rem !important;
                  height: 1.25rem !important;
                }
              }
            `}
          >
            <button type="button" onClick={playAlbum}>
              <FontAwesomeIcon icon={faPlay} /> Play
            </button>
            <button type="button" onClick={playShuffledAlbum}>
              <FontAwesomeIcon icon={faRandom} /> Shuffle
            </button>
          </div>
        </div>
      </header>
      <ol>
        {album.data.relationships.tracks.data.map((track: any) => (
          <li key={track.id} data-track={track.attributes.trackNumber}>
            <button
              data-explicit={
                track.attributes.contentRating === 'explicit' ? 'E' : ''
              }
              type="button"
              onClick={() => {
                playSong(track);
              }}
            >
              {track.attributes.name}
            </button>
          </li>
        ))}
      </ol>
      <p>
        {album.data.attributes.trackCount} songs,{' '}
        {ms(albumDuration, { long: true })}
      </p>

      {music.player.queue.length > 0 && (
        <footer
          css={`
            width: 100%;

            div {
              display: flex;
              justify-content: space-between;
            }

            progress {
              appearance: none;
              border-radius: 2px;
              overflow: hidden;
              height: 4px;
              width: 100%;
            }
          `}
        >
          <progress value={time / duration} />
          <div>
            <span>{fmtMSS(time)}</span>
            <span>{fmtMSS(duration)}</span>
          </div>
        </footer>
      )}
    </AlbumPage>
  );
};

// @ts-ignore
Album.getInitialProps = async context => {
  const host = getHost(context.req);
  const { id } = context.query;
  const url = `${host}/token`;
  const tokenPromise = await fetch(url);
  const { token } = await tokenPromise.json();
  const { bXVzaWMuem40OG5zOGhhcC51 } = parseCookies(context);

  if (!bXVzaWMuem40OG5zOGhhcC51) {
    redirect(context.res, 302, '/login');
  }

  const promise = await fetchMusic(
    `/v1/me/library/albums/${id}`,
    token,
    bXVzaWMuem40OG5zOGhhcC51
  );

  const album = await promise.json();

  return {
    token,
    album: { data: album.data[0] },
    musicUserToken: bXVzaWMuem40OG5zOGhhcC51,
  };
};

export default Album;
