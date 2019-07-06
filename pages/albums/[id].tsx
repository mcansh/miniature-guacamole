import React from 'react';
import { ellipsis } from 'polished';
import { NextPage } from 'next';
import { parseCookies } from 'nookies';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import ms from 'ms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faRandom,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

import { Album as AlbumType, Track } from '~/types';
import { ShuffleModeSongs, redirect, getHost, fetchMusic } from '~/utils';
import Link from 'next/link';

const AlbumPage = styled.div`
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  padding-top: 7.4rem;

  nav {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    font-size: 2rem;
    padding: 2rem;
    a {
      color: #e94b63;
      text-decoration: none;
    }
  }

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
        ${ellipsis('90%')};
        display: flex;
        align-items: center;
        flex-grow: 1;
        padding: 1.6rem 0;
        background: none;
        cursor: pointer;
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

  .metadata {
    font-size: 1.6rem;
    color: #898a8e;
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
      <nav>
        <Link href="/">
          <a>
            <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon> Library
          </a>
        </Link>
      </nav>
      <header>
        <img
          src={album.data.attributes.artwork.url.replace(/{w}|{h}/g, '600')}
          alt={album.data.attributes.name}
        />
        <div>
          <h1>{album.data.attributes.name}</h1>
          <h2 style={{ color: '#e94b63' }}>
            {album.data.attributes.artistName}
          </h2>
          <div
            css={`
              margin-top: 2rem;

              button {
                background: #f1f2f6;
                border: none;
                padding: 0.5rem 2rem;
                margin: 0;
                color: #e94b63;
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
            <button type="button" onClick={() => playSong(track)}>
              {track.attributes.name}
            </button>
          </li>
        ))}
      </ol>
      <p className="metadata">
        {album.data.attributes.trackCount} songs,{' '}
        {ms(albumDuration, { long: true })}
      </p>
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