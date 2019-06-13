import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import {NowRequest, NowResponse} from '@now/node'

export default async (_req: NowRequest, res: NowResponse) => {
  const privateKey = fs.readFileSync(path.join(__dirname, 'AuthKey.p8')).toString();

  const teamId = 'ZN48NS8HAP';
  const keyId = '238VDP8HGK';
  const jwtToken = await jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: teamId,
    header: {
      alg: 'ES256',
      kid: keyId,
    },
  });

  res.json({ token: jwtToken });
};
