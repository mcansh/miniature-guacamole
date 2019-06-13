const withSourceMaps = require('@zeit/next-source-maps')();
const withOffline = require('next-offline');

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

  env: {
    VERSION: require('./package.json').version,
  },
};

module.exports = withSourceMaps(withOffline(nextConfig));
