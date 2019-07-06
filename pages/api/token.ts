import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const privateKey = `-----BEGIN PRIVATE KEY-----
${String(process.env.GUAC_AUTH_KEY)}
-----END PRIVATE KEY-----`;

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

  return res.json({ token: jwtToken });
};
