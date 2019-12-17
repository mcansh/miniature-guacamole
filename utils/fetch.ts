import fetch from "isomorphic-unfetch";

const fetchMusic = async (
  input: string,
  devToken: string,
  musicUserToken: string
) => {
  const defaultHeaders = {
    Authorization: `Bearer ${devToken}`,
    "Music-User-Token": musicUserToken
  };

  const promise = await fetch(`${process.env.MUSIC}${input}`, {
    headers: {
      ...defaultHeaders
    }
  });

  return promise;
};

export { fetchMusic };
