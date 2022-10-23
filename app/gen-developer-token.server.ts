import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import { GUAC_KEY_ID, GUAC_TEAM_ID } from "./constants.server";

export function generateDeveloperToken(): string {
  let privateKey = fs.readFileSync(
    path.join(process.cwd(), "AuthKey_V69Q5367TF.p8")
  );

  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      iss: GUAC_TEAM_ID,
      exp: now + 15777000,
      iat: now,
    },
    privateKey,
    {
      header: {
        alg: "ES256",
        kid: GUAC_KEY_ID,
      },
    }
  );
}
