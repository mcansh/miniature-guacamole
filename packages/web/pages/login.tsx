import React from 'react';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import { NextPage } from 'next';
import { parseCookies, setCookie } from 'nookies';
import getHost from '~/utils/get-host';
import redirect from '~/utils/redirect';
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

interface LoginProps {
  MusicKit: any;
}

// @ts-ignore
const Login: NextPage<LoginProps> = ({ MusicKit }: LoginProps) => {
  const authorize = async () => {
    const music = MusicKit.getInstance();
    const musicUserToken = await music.authorize();
    setCookie({}, 'musicUserToken', musicUserToken, undefined);
    redirect(undefined, 302, '/');
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

// @ts-ignore
Login.getInitialProps = async context => {
  const { musicUserToken } = parseCookies(context);
  if (musicUserToken) {
    redirect(context.res, 302, '/');
  }
  const host = getHost(context.req);
  const url = `${host}/token`;
  const promise = await fetch(url);
  const { token } = await promise.json();

  return { developerToken: token };
};

export default Login;
