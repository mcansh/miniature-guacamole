const withSourceMaps = require('@zeit/next-source-maps')();
const withOffline = require('next-offline');
const pkg = require('./package.json');

const nextConfig = {
  // service worker
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

  // actual next config
  crossOrigin: 'anonymous',
  target: 'serverless',
  experimental: { dynamicRouting: true },
  env: {
    VERSION: pkg.version,
    DESCRIPTION: pkg.description,
    MUSIC: 'https://api.music.apple.com',
    SENTRY: process.env.SENTRY,
  },
};

module.exports = withSourceMaps(withOffline(nextConfig));
