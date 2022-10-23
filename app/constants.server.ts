if (!process.env.GUAC_AUTH_KEY) {
  throw new Error("GUAC_AUTH_KEY is required");
}

if (!process.env.GUAC_TEAM_ID) {
  throw new Error(`GUAC_TEAM_ID is required`);
}

if (!process.env.GUAC_KEY_ID) {
  throw new Error(`GUAC_KEY_ID is required`);
}

if (!process.env.SESSION_PASSWORD) {
  throw new Error(`SESSION_PASSWORD is required`);
}

if (!process.env.MUSIC_API) {
  throw new Error(`MUSIC_API is required`);
}

export const GUAC_AUTH_KEY = process.env.GUAC_AUTH_KEY;
export const GUAC_TEAM_ID = process.env.GUAC_TEAM_ID;
export const GUAC_KEY_ID = process.env.GUAC_KEY_ID;
export const SESSION_PASSWORD = process.env.SESSION_PASSWORD;
export const MUSIC_API = process.env.MUSIC_API;
