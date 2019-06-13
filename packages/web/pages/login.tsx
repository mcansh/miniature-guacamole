import React from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import NoSSR from 'react-no-ssr';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import getHost from '~/utils/get-host';
import redirect from '~/utils/redirect';

const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin-bottom: 2rem;
    font-size: 4rem;
  }

  h2 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  button {
    border: none;
    background: linear-gradient(225deg, #e65f83 0%, #7d69fc 100%),
      linear-gradient(135deg, #f75b6c 0%, #3da2ed 100%);
    border-radius: 4px;
    font-size: 1.4rem;
    padding: 1.4rem 2.5rem;
    cursor: pointer;
  }
`;

class Login extends React.Component<{ token: string }> {
  static getInitialProps = async (context: NextPageContext) => {
    const { musicUserToken } = parseCookies(context);
    if (musicUserToken) {
      redirect(context.res, 302, '/');
    }
    const host = getHost(context.req);
    const url = `${host}/token`;
    const promise = await fetch(url);
    const { token } = await promise.json();

    return { token };
  };

  componentDidMount() {
    const { token } = this.props;
    document.addEventListener('musickitloaded', () => {
      // MusicKit global is now defined
      // @ts-ignore
      window.MusicKit.configure({
        developerToken: token,
        app: {
          name: 'miniature-guacamole',
          build: process.env.VERSION,
        },
      });
    });
  }

  authorize = async () => {
    // @ts-ignore
    const music = window.MusicKit.getInstance();
    const musicUserToken = await music.authorize();
    document.cookie = `musicUserToken=${musicUserToken}`;
    redirect(undefined, 302, '/');
  };

  render() {
    const { token } = this.props;
    return (
      <>
        <Head>
          <meta name="apple-music-developer-token" content={token} />
          <meta name="apple-music-app-name" content="My Cool Web App" />
          <meta name="apple-music-app-build" content="0.0.1" />
          <script
            async
            defer
            src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
          />
        </Head>
        <Page>
          <h1>
            Miniature Guacamole{' '}
            <span role="img" aria-label="avocado">
              🥑
            </span>
          </h1>
          <h2>An Apple Music web player</h2>
          <NoSSR>
            <button type="button" onClick={this.authorize}>
              Sign in to Apple Music
            </button>
          </NoSSR>
        </Page>
      </>
    );
  }
}

export default Login;
