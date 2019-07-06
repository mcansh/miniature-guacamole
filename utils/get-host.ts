import { IncomingMessage } from 'http';

function getProtocol(req?: IncomingMessage) {
  if (req) {
    if (req.headers['x-forwarded-proto']) {
      return req.headers['x-forwarded-proto'];
    }

    if (req.connection) {
      // @ts-ignore
      return req.connection.encrypted ? 'https' : 'http';
    }

    return 'http';
  }

  return window.location.protocol;
}

function getHost(req?: IncomingMessage) {
  const protocol = getProtocol(req);
  if (req) {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return `${protocol}://${host}/api`;
  }

  const { host } = window.location;

  return `${protocol}//${host}/api`;
}

export { getHost };
