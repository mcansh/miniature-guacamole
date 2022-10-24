import type { ActionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { GUAC_TEAM_ID } from "~/constants.server";
import { createUserSession } from "~/session.server";

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let userToken = formData.get("user-token");

  if (!userToken || typeof userToken !== "string") {
    throw new Response("", { status: 400 });
  }

  let url = new URL(request.url);
  let redirectTo = url.searchParams.get("redirectTo") ?? "/";

  return createUserSession(request, userToken, redirectTo);
}

export function loader() {
  return {
    TEAM_ID: GUAC_TEAM_ID.toLowerCase(),
  };
}

export default function Login() {
  let data = useLoaderData<typeof loader>();
  let submit = useSubmit();

  let authorize = async () => {
    let music = window.MusicKit.getInstance();
    await music.authorize();

    let id = `music.${data.TEAM_ID}.media-user-token`;
    let userToken = window.localStorage.getItem(id);
    if (!userToken) return;

    let formData = new FormData();
    formData.set("user-token", userToken);
    submit(formData, { method: "post" });
  };

  return (
    <div>
      <h1>
        Miniature Guacamole{" "}
        <span role="img" aria-label="avocado">
          🥑
        </span>
      </h1>
      <h2>An Apple Music web player</h2>
      <button
        className={
          "rounded-md text-white px-10 py-3.5 bg-gradient-to-br from-[#e65f83] to-[#7d69fc]"
        }
        type="button"
        onClick={authorize}
      >
        Sign in to Apple Music
      </button>
    </div>
  );
}
