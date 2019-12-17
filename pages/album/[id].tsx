import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { getBaseURL } from '@mcansh/next-now-base-url';

import { fetchMusic } from '~/utils';

const AlbumPage: NextPage<{
  devToken: string;
  userToken: string;
  initialData: any;
}> = ({ devToken, userToken, initialData }) => {
  const { query } = useRouter();
  const { data, isValidating } = useSWR(
    [
      `${process.env.MUSIC}/v1/me/library/albums/${query.id}`,
      devToken,
      userToken,
    ],
    fetchMusic,
    { initialData }
  );

  if (isValidating) return <p>loading...</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

AlbumPage.getInitialProps = async context => {
  const { query, req, res } = context;

  const { redirect } = await import('~/utils/redirect');
  // 1. get the base url from either x-forwarded headers (now) or host
  const base = getBaseURL(req);
  // 2. get a developer jwt token
  const devTokenPromise = await fetch(`${base}/api/token`);
  const devTokenData = await devTokenPromise.json();
  const devToken = devTokenData.token;
  // 3. dynamically import nookies to parse cookies
  const { parseCookies } = await import('nookies');
  const cookies = parseCookies(context);
  // 4. no idea why this is the name of the cookie, but it's the user token
  const { bXVzaWMuem40OG5zOGhhcC51: userToken } = cookies;
  // 4a. if no user token, redirect to login page
  if (!userToken) {
    redirect(res, 302, '/login');
    return { initialData: {}, devToken: '', userToken: '' };
  }
  // 5. fetch the current user's recently added music
  const initialData = await fetchMusic(
    `/v1/me/library/albums/${query.id}`,
    devToken,
    userToken
  );

  return { initialData, devToken, userToken };
};

export default AlbumPage;
