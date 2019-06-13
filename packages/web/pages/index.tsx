import React from 'react';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import getHost from '~/utils/get-host';
import redirect from '~/utils/redirect';

interface RecentlyAddedItem {
  id: string;
  type: string;
  href: string;
  attributes: {
    artistName: string;
    name: string;
    playParams: {
      id: string;
      kind: string;
      isLibrary: boolean;
    };
    artwork: {
      width: number;
      height: number;
      url: string;
    };
    trackCount: number;
  };
}

interface Props {
  token: string;
  recentlyAddedFromServer: { data: RecentlyAddedItem[]; next: string };
  musicUserToken: string;
}
const Index = ({ token, musicUserToken, recentlyAddedFromServer }: Props) => {
  const [recentlyAdded, setRecentlyAdded] = React.useState<{
    data: RecentlyAddedItem[];
    next: string;
  }>(() => {
    if (recentlyAddedFromServer) return recentlyAddedFromServer;
    return { data: [], next: '/v1/me/library/recently-added?offset=0' };
  });

  const loadMore = async (nextUrl: string) => {
    const promise = await fetch(`${process.env.MUSIC}${nextUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Music-User-Token': musicUserToken,
      },
    });

    const items = await promise.json();

    setRecentlyAdded(old => ({
      data: [...old.data, ...items.data],
      next: items.next,
    }));
  };

  return (
    <>
      <Head>
        <title>hello</title>
      </Head>
      <ul
        css={`
          padding: 0;
          list-style: none;
          margin: 0 auto;
          max-width: 520px;
          justify-content: center;
          align-items: center;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          grid-gap: 10px 20px;

          a {
            color: inherit;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          img {
            width: 100%;
            display: block;
            margin-bottom: 1rem;
          }
        `}
      >
        {recentlyAdded.data.map(item => (
          <li key={item.id}>
            <Link href="/albums/$id" as={`/albums/${item.id}`}>
              <a>
                <img
                  src={item.attributes.artwork.url.replace(/{w}|{h}/g, '600')}
                  alt={item.attributes.name}
                />
                <p>{item.attributes.name}</p>
                <p>{item.attributes.artistName}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(recentlyAdded, null, 2)}</pre>
      <button type="button" onClick={() => loadMore(recentlyAdded.next)}>
        Load more
      </button>
    </>
  );
};

Index.getInitialProps = async (context: NextPageContext) => {
  const host = getHost(context.req);
  const url = `${host}/token`;
  const promise = await fetch(url);
  const { token } = await promise.json();
  const { musicUserToken } = parseCookies(context);

  if (!musicUserToken) {
    redirect(context.res, 302, '/login');
  }

  const recentPromise = await fetch(
    `${process.env.MUSIC}/v1/me/library/recently-added`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Music-User-Token': musicUserToken,
      },
    }
  );

  const recentlyAddedFromServer = await recentPromise.json();

  return { token, recentlyAddedFromServer, musicUserToken };
};

export default Index;
