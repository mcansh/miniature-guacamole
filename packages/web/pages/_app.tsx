import React from 'react';
import App, { Container, AppContext } from 'next/app';
import * as Sentry from '@sentry/browser';
import Head from 'next/head';

import Layout from '~/components/layout';

Sentry.init({
  dsn: process.env.SENTRY,
  environment: process.env.NODE_ENV,
  release: `guac@${process.env.VERSION}`,
});

declare global {
  interface Window {
    MusicKit: any;
  }
}

class MyApp extends App {
  state = { MusicKit: null };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  componentDidMount = () => {
    window.MusicKit.configure({
      developerToken: this.props.pageProps.developerToken,
      persist: 'cookie',
      app: {
        name: 'Miniature Guacamole 🥑',
        build: process.env.VERSION,
        icon: '/favicon.png',
      },
    });

    this.setState({ MusicKit: window.MusicKit });
  };

  static getInitialProps = async ({ Component, ctx }: AppContext) => {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  };

  render() {
    const { Component, pageProps } = this.props;
    const { MusicKit } = this.state;

    return (
      <Container>
        <Head>
          <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js" />
        </Head>
        <Layout>
          <Component {...pageProps} MusicKit={MusicKit} />
        </Layout>
      </Container>
    );
  }
}

export default MyApp;
