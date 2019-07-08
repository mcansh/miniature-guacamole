import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const privateKey = `-----BEGIN PRIVATE KEY-----
${String(process.env.GUAC_AUTH_KEY)}
-----END PRIVATE KEY-----`;

  const teamId = process.env.GUAC_TEAM_ID;
  const keyId = process.env.GUAC_KEY_ID;
  const jwtToken = await jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: teamId,
    header: {
      alg: 'ES256',
      kid: keyId,
    },
  });

  res.status(200);
  res.json({ token: jwtToken });
};
