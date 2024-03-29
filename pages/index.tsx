import React from "react";
import Link from "next/link";
import { parseCookies } from "nookies";
import { NextPageContext } from "next";
import { SimpleImg } from "react-simple-img";
import { ellipsis } from "polished";

import Button from "~/components/styles/button";
import { artworkForMediaItem, getHost, redirect, fetchMusic } from "~/utils";

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
  developerToken: string;
  recentlyAddedFromServer: { data: RecentlyAddedItem[]; next: string };
  musicUserToken: string;
}

const Index = ({
  developerToken,
  musicUserToken,
  recentlyAddedFromServer
}: Props) => {
  const [recentlyAdded, setRecentlyAdded] = React.useState<{
    data: RecentlyAddedItem[];
    next: string;
  }>(() => {
    if (recentlyAddedFromServer) return recentlyAddedFromServer;
    return { data: [], next: "/v1/me/library/recently-added?offset=0" };
  });

  const loadMore = async (nextUrl: string) => {
    const promise = await fetchMusic(nextUrl, developerToken, musicUserToken);

    const items = await promise.json();

    setRecentlyAdded(old => ({
      data: [...old.data, ...items.data],
      next: items.next
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
        {recentlyAdded.data.map(item => (
          <li key={item.id}>
            <div>
              <Link href="/albums/[id]" as={`/albums/${item.id}`}>
                <a>
                  <SimpleImg
                    height="100%"
                    width="100%"
                    placeholder={artworkForMediaItem(undefined, 600)}
                    src={item?.attributes?.artwork?.url.replace(
                      /{w}|{h}/g,
                      "400"
                    )}
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
                    sizes="(max-width: 3000px) 100vw, 3000px"
                  />
                  <p style={{ ...ellipsis("90%"), marginTop: "1rem" }}>
                    {item.attributes.name}
                  </p>
                  <p>{item.attributes.artistName}</p>
                </a>
              </Link>
            </div>
          </li>
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
  // 1. fetch the jwt for apple music
  const host = getHost(context.req);
  const url = `${host}/token`;
  const promise = await fetch(url);
  const { token } = await promise.json();
  // 2. check if the user is logged in
  const { bXVzaWMuem40OG5zOGhhcC51: userToken } = parseCookies(context);

  if (!userToken) {
    return redirect(context.res, 302, "/login");
  }

  // 3. fetch the most recent 30 added things
  const musicPromise = await fetchMusic(
    "/v1/me/library/recently-added?limit=25",
    token,
    userToken
  );

  const recentlyAddedFromServer = await musicPromise.json();

  return {
    developerToken: token,
    recentlyAddedFromServer,
    musicUserToken: userToken
  };
};

export default Index;
