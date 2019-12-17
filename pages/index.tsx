import React from 'react';
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import Link from 'next/link';
import { SimpleImg } from 'react-simple-img';
import { ellipsis } from 'polished';

import Button from '~/components/styles/button';
import { artworkForMediaItem, redirect, fetchMusic } from '~/utils';

const AlbumListItem = ({ item }: { item: any }) => (
  <li>
    <div
      css={`
        img {
          object-fit: cover;
        }

        a {
          font-size: 1.6rem;
          color: black;
          text-decoration: none;
          @media (prefers-color-scheme: dark) {
            color: white;
          }
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
              ${artworkForMediaItem(item, 50)} 50w,
              ${artworkForMediaItem(item, 100)} 100w,
              ${artworkForMediaItem(item, 200)} 200w,
              ${artworkForMediaItem(item, 300)} 300w,
              ${artworkForMediaItem(item, 600)} 600w,
              ${artworkForMediaItem(item, 800)} 800w,
              ${artworkForMediaItem(item, 1200)} 1200w,
              ${artworkForMediaItem(item, 1600)} 1600w,
              ${artworkForMediaItem(item, 1800)} 1800w,
              ${artworkForMediaItem(item, 2000)} 2000w,
              ${artworkForMediaItem(item, 2400)} 2400w,
              ${artworkForMediaItem(item, 3000)} 3000w,
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

interface Props {
  developerToken: string;
  recentlyAddedFromServer: { data: any[]; next: string };
  musicUserToken: string;
}

const Index = ({
  developerToken,
  musicUserToken,
  recentlyAddedFromServer,
}: Props) => {
  const [recentlyAdded, setRecentlyAdded] = React.useState<{
    data: any[];
    next: string;
  }>(() => {
    if (recentlyAddedFromServer) return recentlyAddedFromServer;
    return { data: [], next: '/v1/me/library/recently-added?limit=25' };
  });

  const loadMore = async (nextUrl: string) => {
    const promise = await fetchMusic(nextUrl, developerToken, musicUserToken);

    const items = await promise.json();

    setRecentlyAdded(old => ({
      data: [...old.data, ...items.data],
      next: items.next,
    }));
  };

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
        {recentlyAdded.data.map(item => (
          <AlbumListItem key={item.id} item={item} />
        ))}
      </ul>
      <Button
        type="button"
        onClick={() => loadMore(recentlyAdded.next)}
        css={`
          margin: 2rem auto 7rem;
        `}
      >
        Load more
      </Button>
    </>
  );
};

Index.getInitialProps = async (context: NextPageContext) => {
  const { getBaseURL } = await import('@mcansh/next-now-base-url');
  // 1. fetch the jwt for apple music
  const host = getBaseURL(context.req);
  const url = `${host}/api/token`;
  const promise = await fetch(url);
  const { token } = await promise.json();
  // 2. check if the user is logged in
  const { bXVzaWMuem40OG5zOGhhcC51: userToken } = parseCookies(context);

  if (!userToken) {
    return redirect(context.res, 302, '/login');
  }

  // 3. fetch the most recent 30 added things
  const musicPromise = await fetchMusic(
    '/v1/me/library/recently-added?limit=25',
    token,
    userToken
  );

  const recentlyAddedFromServer = await musicPromise.json();

  return {
    developerToken: token,
    recentlyAddedFromServer,
    musicUserToken: userToken,
  };
};

export default Index;
