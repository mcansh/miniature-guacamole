const path = require('path');

const withSourceMaps = require('@zeit/next-source-maps')();
const withOffline = require('next-offline');

const pkg = require('./package.json');

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line import/no-extraneous-dependencies
  require('dotenv').config();
}

const nextConfig = {
  dontAutoRegisterSw: true,
  workboxOpts: {
    swDest: 'static/sw.js',
    runtimeCaching: [
      {
        handler: 'StaleWhileRevalidate',
        urlPattern: /[.](webp|png|jpg|woff|woff2)/,
      },
      {
        handler: 'NetworkFirst',
        urlPattern: /^https?.*/,
      },
    ],
  },

  crossOrigin: 'anonymous',
  target: 'serverless',
  experimental: {
    css: true,
    granularChunks: true,
    modern: true,
    plugins: true,
  },
  env: {
    VERSION: pkg.version,
    DESCRIPTION: pkg.description,
    MUSIC: 'https://api.music.apple.com',
    SENTRY_DSN: 'https://9ce1145ae4fa40a1bfc13806d273566d@sentry.io/1481617',
    SENTRY_RELEASE: `guac@${pkg.version}`,
    GUAC_AUTH_KEY: process.env.GUAC_AUTH_KEY,
    GUAC_TEAM_ID: process.env.GUAC_TEAM_ID,
    GUAC_KEY_ID: process.env.GUAC_KEY_ID,
  },

  webpack: config => {
    config.resolve.alias['~'] = path.resolve('./');
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  prefixIds: {
                    delim: '_',
                    prefixIds: true,
                    prefixClassNames: false,
                  },
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

module.exports = withSourceMaps(withOffline(nextConfig));
