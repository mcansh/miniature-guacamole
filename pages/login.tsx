import React from 'react';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import { NextPage } from 'next';
import Router from 'next/router';

import { redirect } from '~/utils';
import Button from '~/components/styles/button';

const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin-bottom: 2rem;
    font-size: 4rem;
    text-align: center;
    @media (max-width: 500px) {
      font-size: 3.6rem;
    }
  }

  h2 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
`;

const Login: NextPage = () => {
  const authorize = async () => {
    const music = window.MusicKit.getInstance();
    await music.authorize();
    Router.replace('/');
  };

  return (
    <Page>
      <h1>
        Miniature Guacamole{' '}
        <span role="img" aria-label="avocado">
          🥑
        </span>
      </h1>
      <h2>An Apple Music web player</h2>
      <Button type="button" onClick={authorize}>
        Sign in to Apple Music
      </Button>
    </Page>
  );
};

Login.getInitialProps = async context => {
  const { parseCookies } = await import('nookies');
  const { getBaseURL } = await import('@mcansh/next-now-base-url');
  const { bXVzaWMuem40OG5zOGhhcC51 } = parseCookies(context);
  if (bXVzaWMuem40OG5zOGhhcC51) {
    redirect(context.res, 302, '/');
  }
  const host = getBaseURL(context.req);
  const url = `${host}/api/token`;
  const promise = await fetch(url);
  const { token } = await promise.json();

  return { developerToken: token, musicUserToken: bXVzaWMuem40OG5zOGhhcC51 };
};

export default Login;
