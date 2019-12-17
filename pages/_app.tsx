import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import Layout from '~/components/layout';

declare global {
  interface Window {
    MusicKit: any;
  }
}

class MyApp extends App {
  public componentDidMount = () => {
    window.MusicKit.configure({
      developerToken: this.props.pageProps.developerToken,
      persist: 'cookie',
      app: {
        name: 'Miniature Guacamole 🥑',
        build: process.env.VERSION,
        icon: '/favicon.png',
      },
    });
  };

  public render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}

export default MyApp;
