import * as React from "react";
import type { ActionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import appStylesHref from "~/styles/app.css";

import { generateDeveloperToken } from "./gen-developer-token.server";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: appStylesHref,
    },
  ];
};

export async function loader() {
  let token = generateDeveloperToken();

  return {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERSION: "1",
      DEVELOPER_TOKEN: token,
    },
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width, initial-scale=1",
    "apple-music-developer-token": data.env.DEVELOPER_TOKEN,
    "apple-music-app-name": "Miniature Guacamole 🥑",
    "apple-music-app-build": data.env.VERSION,
  };
};

export default function App() {
  let data = useLoaderData<typeof loader>();

  React.useEffect(() => {
    document.addEventListener("musickitloaded", async () => {
      try {
        await window.MusicKit.configure({
          developerToken: data.env.DEVELOPER_TOKEN,
          app: {
            name: "Miniature Guacamole 🥑",
            build: data.env.VERSION,
          },
        });
      } catch (error) {
        console.error(`uhhh`, error);
      }
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
          data-web-components
          async
        />
      </body>
    </html>
  );
}
