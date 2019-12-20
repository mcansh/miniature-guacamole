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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const music = window.MusicKit.getInstance();
    const token = await music.authorize();
    document.cookie = `userToken=${token}`;
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
  const { getBaseURL } = await import('@mcansh/next-now-base-url');
  const { parseCookies } = await import('nookies');

  const host = getBaseURL(context.req);
  const url = `${host}/api/token`;
  const promise = await fetch(url);
  const { token } = await promise.json();

  const { userToken } = parseCookies(context);
  if (userToken) {
    redirect(context.res, 302, '/');
  }

  return { devToken: token, userToken };
};

export default Login;
