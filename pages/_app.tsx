import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import Layout from '~/components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    if (pageProps.devToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      window.MusicKit.configure({
        developerToken: pageProps.devToken,
        app: {
          name: 'Miniature Guacamole 🥑',
          build: process.env.VERSION,
          icon: '/favicon.png',
        },
      });
    }
  }, [pageProps.devToken]);

  return (
    <Layout>
      {pageProps.devToken && (
        <Head>
          <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js" />
        </Head>
      )}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
