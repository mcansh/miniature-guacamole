import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { addDays } from "date-fns";

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const privateKey = `-----BEGIN PRIVATE KEY-----
${String(process.env.GUAC_AUTH_KEY)}
-----END PRIVATE KEY-----`;

  const teamId = process.env.GUAC_TEAM_ID;
  const keyId = process.env.GUAC_KEY_ID;
  const token = await jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "180d",
    issuer: teamId,
    header: {
      alg: "ES256",
      kid: keyId
    }
  });

  const now = new Date();
  const expirationDate = addDays(now, 180).getTime();

  res.status(200);
  res.json({ token, expirationDate });
};
