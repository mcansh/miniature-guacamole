import React from 'react';
import { ellipsis } from 'polished';
import { NextPage } from 'next';
import { parseCookies } from 'nookies';
import redirect from '~/utils/redirect';
import getHost from '~/utils/get-host';
import styled from 'styled-components';

const AlbumPage = styled.div`
  padding-left: 1rem;
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
    max-width: 520px;
    width: 100%;

    li {
      font-size: 1.6rem;
      display: flex;
      align-items: center;

      p {
        border-bottom: 1px solid #494949;
        display: inline-flex;
        align-items: center;
        flex-grow: 1;
        padding: 1.6rem 0;
        ${ellipsis('90%')};

        &::after {
          content: attr(data-explicit);
          display: inline-flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 1.4rem;
          height: 1.4rem;
          font-size: 1rem;
          background: #8d8d92;
          color: black;
          border-radius: 2px;
          line-height: 1;
          margin-left: 0.5rem;
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

const Album: NextPage<{ album: any }> = ({ album }: { album: any }) => (
  <AlbumPage>
    <header>
      <img
        src={album.data.attributes.artwork.url.replace(/{w}|{h}/g, '600')}
        alt={album.data.attributes.name}
      />
      <div>
        <h1>{album.data.attributes.name}</h1>
        <h2>{album.data.attributes.artistName}</h2>
      </div>
    </header>
    <ol>
      {album.data.relationships.tracks.data.map((track: any) => (
        <li key={track.id} data-track={track.attributes.trackNumber}>
          <p
            data-explicit={
              track.attributes.contentRating === 'explicit' ? 'E' : ''
            }
          >
            {track.attributes.name}
          </p>
        </li>
      ))}
    </ol>
  </AlbumPage>
);

Album.getInitialProps = async context => {
  const host = getHost(context.req);
  const { id } = context.query;
  const url = `${host}/token`;
  const tokenPromise = await fetch(url);
  const { token } = await tokenPromise.json();
  const { musicUserToken } = parseCookies(context);

  if (!musicUserToken) {
    redirect(context.res, 302, '/login');
  }

  const promise = await fetch(
    `${process.env.MUSIC}/v1/me/library/albums/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Music-User-Token': musicUserToken,
      },
    }
  );

  const album = await promise.json();

  return { token, album: { data: album.data[0] }, musicUserToken };
};

export default Album;
