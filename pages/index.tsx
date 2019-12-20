import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { SimpleImg } from 'react-simple-img';
import { ellipsis } from 'polished';
import useSWR, { mutate } from 'swr';

import Button from '~/components/styles/button';
import {
  fetchMusic,
  redirect,
  artworkForMediaItem,
  Success,
  ErrorType,
} from '~/utils';

const AlbumListItem = ({ item }: { item: any }) => (
  <li>
    <div
      css={`
        img {
          object-fit: cover;
        }

        a {
          font-size: 1.6rem;
          color: var(--primary-text-color);
          text-decoration: none;
        }
      `}
    >
      <Link href="/album/[id]" as={`/album/${item.id}`} shallow>
        <a>
          <SimpleImg
            height="100%"
            width="100%"
            placeholder={artworkForMediaItem(undefined, 600)}
            src={artworkForMediaItem(item, 400)}
            applyAspectRatio
            alt={item.attributes.name}
            srcSet={`
              ${artworkForMediaItem(item.attributes?.artwork?.url, 50)} 50w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 100)} 100w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 200)} 200w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 300)} 300w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 600)} 600w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 800)} 800w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 1200)} 1200w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 1600)} 1600w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 1800)} 1800w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 2000)} 2000w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 2400)} 2400w,
              ${artworkForMediaItem(item.attributes?.artwork?.url, 3000)} 3000w,
            `}
          />
          <p style={{ ...ellipsis('90%'), marginTop: '1rem' }}>
            {item.attributes.name}
          </p>
          <p>{item.attributes.artistName}</p>
        </a>
      </Link>
    </div>
  </li>
);

interface IndexPageProps {
  recentlyAddedFromServer: Success | ErrorType;
  devToken: string;
  userToken: string;
}

const Index: NextPage<IndexPageProps> = ({
  recentlyAddedFromServer,
  devToken,
  userToken,
}) => {
  const { data } = useSWR(
    () =>
      devToken &&
      userToken && [
        '/v1/me/library/recently-added?limit=24',
        devToken,
        userToken,
      ],
    fetchMusic,
    { initialData: recentlyAddedFromServer }
  );

  return (
    <>
      <ul
        css={`
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
          grid-gap: 3rem;
          padding: 0;
          margin: 3rem auto;
          list-style: none;
          max-width: 700px;
          width: 95%;
        `}
      >
        {(!data || !data.data) && <pre>{JSON.stringify(data, null, 2)}</pre>}
        {data?.data.map((item: any) => (
          <AlbumListItem key={item.id} item={item} />
        ))}
      </ul>
      <Button
        type="button"
        css={`
          margin: 2rem auto 7rem;
        `}
        onClick={async () => {
          const moreMusic = await fetchMusic(
            `/v1/me/library/recently-added?limit=24&offset=${data?.data
              ?.length ?? 0}`,
            devToken,
            userToken
          );
          mutate(
            ['/v1/me/library/recently-added?limit=24', devToken, userToken],
            {
              ...data,
              data: moreMusic.data
                ? [...data.data, ...moreMusic.data]
                : data.data,
              next: moreMusic.next,
            }
          );
        }}
      >
        Load more
      </Button>
    </>
  );
};

Index.getInitialProps = async context => {
  const { getBaseURL } = await import('@mcansh/next-now-base-url');
  const { parseCookies } = await import('nookies');

  const host = getBaseURL(context.req);
  const url = `${host}/api/token`;
  const promise = await fetch(url);
  const { token } = await promise.json();

  const { userToken } = parseCookies(context);
  if (!userToken) {
    redirect(context.res, 302, '/login');
  }

  try {
    const recentlyAddedFromServer = await fetchMusic(
      '/v1/me/library/recently-added?limit=24',
      token,
      userToken
    );
    return { recentlyAddedFromServer, devToken: token, userToken };
  } catch (error) {
    console.error(error);
    return {
      recentlyAddedFromServer: { data: [], next: '' },
      userToken: '',
      devToken: '',
    };
  }
};

export default Index;
