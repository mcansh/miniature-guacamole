import type { Session } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { SESSION_PASSWORD } from "./constants.server";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [SESSION_PASSWORD],
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 14, // 2 weeks
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
});

export function getSession(request: Request): Promise<Session> {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

let USER_SESSION_KEY = "bXVzaWMuem40OG5zOGhhcC51";

export async function getUserToken(
  request: Request
): Promise<string | undefined> {
  let session = await getSession(request);
  return session.get(USER_SESSION_KEY);
}

export async function requireUserToken(
  request: Request,
  redirectTo: string = request.url
): Promise<string> {
  let userId = await getUserToken(request);
  if (!userId) {
    let searchParams = new URLSearchParams();
    searchParams.set("redirectTo", redirectTo);
    throw redirect(`/login?${searchParams.toString()}`);
  }
  return userId;
}

export async function createUserSession(
  request: Request,
  userId: string,
  redirectTo: string
) {
  let session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  let session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
