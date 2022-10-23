import jwt from "jsonwebtoken";

import { GUAC_KEY_ID, GUAC_TEAM_ID, GUAC_AUTH_KEY } from "./constants.server";

export function generateDeveloperToken(): string {
  let start = `-----BEGIN PRIVATE KEY-----\n`;
  let end = `\n-----END PRIVATE KEY-----`;
  let privateKey = start + GUAC_AUTH_KEY + end;

  let now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    { iss: GUAC_TEAM_ID, exp: now + 15777000, iat: now },
    privateKey,
    { header: { alg: "ES256", kid: GUAC_KEY_ID } }
  );
}
