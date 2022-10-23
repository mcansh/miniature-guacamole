import * as React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { requireUserToken } from "~/session.server";
import { generateDeveloperToken } from "~/gen-developer-token.server";
import { Await, useLoaderData } from "@remix-run/react";
import LRUCache from "lru-cache";
import type { CacheEntry } from "cachified";
import { cachified } from "cachified";

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
      globalId?: string;
    };
    artwork?: {
      width: number;
      height: number;
      url: string;
    };
    trackCount: number;
  };
}

let lru = new LRUCache<string, CacheEntry<Array<RecentlyAddedItem>>>({
  max: 100,
});

async function fetchMusic(
  input: string,
  devToken: string,
  musicUserToken: string
) {
  let url = new URL(input, process.env.MUSIC_API);
  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${devToken}`,
      "Music-User-Token": musicUserToken,
    },
  });
}

async function getMusic(
  developerToken: string,
  userToken: string,
  count: number = 25,
  offset?: number
): Promise<Array<RecentlyAddedItem>> {
  return cachified({
    key: `recents-${userToken}-${count}-${offset}`,
    cache: lru,
    getFreshValue: async () => {
      let search = new URLSearchParams();
      search.set("limit", count.toString());
      if (offset) search.set("offset", offset.toString());

      let musicPromise = await fetchMusic(
        "/v1/me/library/recently-added?" + search.toString(),
        developerToken,
        userToken
      );

      let music = (await musicPromise.json()) as {
        data: Array<RecentlyAddedItem>;
      };
      return music.data;
    },
    ttl: 300_000,
  });
}

export async function loader({ request }: LoaderArgs) {
  let userToken = await requireUserToken(request);
  let developerToken = generateDeveloperToken();
  let recentlyAddedFromServer = await getMusic(developerToken, userToken, 25);
  let otherMusic = getMusic(developerToken, userToken, 25, 25);
  return defer({ recentlyAddedFromServer, otherMusic });
}

export default function Index() {
  let data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Now Playing:</p>

      <MusicGrid music={data.recentlyAddedFromServer} />

      <React.Suspense fallback={<FallBackMusicGrid count={25} />}>
        <Await errorElement={<p>rats</p>} resolve={data.otherMusic}>
          {(resolvedMusic) => {
            return <MusicGrid music={resolvedMusic} />;
          }}
        </Await>
      </React.Suspense>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

function FallBackMusicGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-5 gap-4 m-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <img
            src={artworkForMediaItem(undefined, 400)}
            height={1200}
            width={1200}
            className="rounded-md aspect-square"
            alt=""
          />
        </div>
      ))}
    </div>
  );
}

function MusicGrid({ music }: { music: Array<RecentlyAddedItem> }) {
  return (
    <div className="grid grid-cols-5 gap-4 m-4">
      {music.map((add) => {
        return (
          <div
            key={add.id}
            onClick={async () => {
              let instance = window.MusicKit.getInstance();

              let type = add.type === "library-albums" ? "album" : "playlist";

              let id =
                type === "playlist"
                  ? add.attributes.playParams.globalId
                  : add.id;

              await instance.setQueue({ [type]: id });
              await instance.play();
            }}
          >
            <img
              src={artworkForMediaItem(add, 400)}
              height={1200}
              width={1200}
              className="rounded-md aspect-square"
              srcSet={`
                ${artworkForMediaItem(add, 50)} 50w,
                ${artworkForMediaItem(add, 100)} 100w,
                ${artworkForMediaItem(add, 200)} 200w,
                ${artworkForMediaItem(add, 300)} 300w,
                ${artworkForMediaItem(add, 600)} 600w,
                ${artworkForMediaItem(add, 800)} 800w,
                ${artworkForMediaItem(add, 1200)} 1200w,
              `}
              sizes="(max-width: 3000px) 100vw, 3000px"
              alt={add.attributes.name + " by " + add.attributes.artistName}
            />
            <div className="flex flex-col pt-2">
              <span className="text-slate-600 text-sm">
                {add.attributes.name}
              </span>
              <span className="text-slate-400 text-xs">
                {add.attributes.artistName}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function artworkForMediaItem(
  item: RecentlyAddedItem | undefined,
  size: number
) {
  if (!item || !item.attributes.artwork) {
    return `https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/${size}x${size}bb.jpeg`;
  }

  return item.attributes.artwork.url.replace(/\{(w|h)\}/g, String(size));
}
