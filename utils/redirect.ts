import { ServerResponse } from 'http';

import Router from 'next/router';
import { LiteralUnion } from 'type-fest';

const redirect = (
  res: ServerResponse | undefined,
  type: LiteralUnion<301 | 302 | 307, number>,
  page: string,
  as: string = page,
  options: {
    replace?: boolean;
  } = { replace: false }
) => {
  if (res) {
    res.writeHead(type, { Location: as });
    res.end();
  } else if (options.replace) {
    Router.replace(page, as);
  } else {
    Router.push(page, as);
  }
};

export { redirect };
