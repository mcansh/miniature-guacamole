import React from 'react';
import { ellipsis, rgba } from 'polished';
import { NextPage } from 'next';
import { parseCookies } from 'nookies';
import Link from 'next/link';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import ms from 'ms';
// @ts-ignore
import { SimpleImg } from 'react-simple-img';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faRandom,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

import { Album as AlbumType, Track } from '~/types';
import {
  ShuffleModeSongs,
  redirect,
  getHost,
  fetchMusic,
  artworkForMediaItem,
} from '~/utils';

const AlbumPage = styled.div`
  max-width: 520px;
  width: 95%;
  margin: 0 auto;
  padding-top: 7.4rem;
  padding-bottom: 11rem;

  nav {
    background: white;
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    font-size: 2rem;
    padding: 2rem;
    z-index: 1;
    @supports (backdrop-filter: blur(0)) {
      background: rgba(255, 255, 255, 0.8);
    }

    @media (prefers-color-scheme: dark) {
      background: #1a1a1a;
      @supports (backdrop-filter: blur(0)) {
        background: ${rgba('#1a1a1a', 0.8)};
      }
    }

    a {
      color: #e94b63;
      text-decoration: none;
    }
  }

  header {
    display: flex;
  }

  ol {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      font-size: 1.6rem;
      display: flex;
      align-items: center;
      border-top: 1px solid #aaa;
      border-bottom: 1px solid #aaa;

      button {
        border: none;
        ${ellipsis('90%')};
        display: flex;
        align-items: center;
        flex-grow: 1;
        padding: 1.6rem 0;
        background: none;
        cursor: pointer;
        color: black;
        @media (prefers-color-scheme: dark) {
          color: white;
        }

        &:disabled {
          color: rgba(0, 0, 0, 0.5);
          cursor: not-allowed;

          @media (prefers-color-scheme: dark) {
            color: rgba(255, 255, 255, 0.5);
          }
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

  .metadata {
    font-size: 1.6rem;
    color: #898a8e;
    margin-top: 0.5rem;
  }
`;

interface Props {
  album: AlbumType;
  developerToken: string;
  musicUserToken: string;
  MusicKit: any;
}

// @ts-ignore
const Album: NextPage<Props> = ({ album, MusicKit }: Props) => {
  const albumDuration = album.data.relationships.tracks.data.reduce(
    (acc, cur) => acc + cur.attributes.durationInMillis,
    0
  );
  const music = MusicKit && MusicKit.getInstance();

  const playSong = async (track: Track) => {
    if (
      !track ||
      !track.attributes ||
      !track.attributes.playParams ||
      !track.attributes.playParams.catalogId
    ) {
      console.error('no catalog id');
    }
    // @ts-ignore
    await music.setQueue({ song: track.attributes.playParams.catalogId });
    await music.play();
  };

  const playAlbum = async () => {
    // @ts-ignore
    await music.setQueue({ album: album.data.attributes.playParams.id });
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
        <SimpleImg
          height="100px"
          width="100px"
          imgStyle={{
            display: 'block',
            objectFit: 'contain',
            marginRight: '1rem',
            borderRadius: '0.8vw',
          }}
          placeholder={artworkForMediaItem(undefined, 100)}
          src={album.data.attributes.artwork.url.replace(/{w}|{h}/g, '600')}
          alt={album.data.attributes.name}
          srcSet={`
            ${artworkForMediaItem(album.data, 50)} 50w,
            ${artworkForMediaItem(album.data, 100)} 100w,
            ${artworkForMediaItem(album.data, 200)} 200w,
            ${artworkForMediaItem(album.data, 300)} 300w,
            ${artworkForMediaItem(album.data, 600)} 600w,
            ${artworkForMediaItem(album.data, 800)} 800w,
            ${artworkForMediaItem(album.data, 1200)} 1200w,
            ${artworkForMediaItem(album.data, 1600)} 1600w,
            ${artworkForMediaItem(album.data, 1800)} 1800w,
            ${artworkForMediaItem(album.data, 2000)} 2000w,
            ${artworkForMediaItem(album.data, 2400)} 2400w,
            ${artworkForMediaItem(album.data, 3000)} 3000w,
          `}
          sizes="(max-width: 3000px) 100vw, 3000px"
        />
        <div>
          <h1>{album.data.attributes.name}</h1>
          <h2 css={{ color: '#e94b63' }}>{album.data.attributes.artistName}</h2>
        </div>
      </header>
      <div
        css={`
          padding-top: 1rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          border-top: 1px solid #aaa;
          display: flex;

          button {
            width: 50%;
            background: #f1f2f6;
            border: none;
            padding: 1rem 2rem;
            margin: 0;
            color: #e94b63;
            border-radius: 4px;
            line-height: 1;
            cursor: pointer;

            @media (prefers-color-scheme: dark) {
              background: #1a1a1a;
            }

            &:first-of-type {
              margin-right: 1rem;
            }

            svg {
              font-size: 1.2rem;
              margin-right: 0.5rem;
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
      <ol>
        {album.data.relationships.tracks.data.map((track: any) => (
          <li key={track.id} data-track={track.attributes.trackNumber}>
            <button
              type="button"
              onClick={() => playSong(track)}
              disabled={track.attributes.playParams == null}
            >
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
    developerToken: token,
    album: { data: album.data[0] },
    musicUserToken: bXVzaWMuem40OG5zOGhhcC51,
  };
};

export default Album;
