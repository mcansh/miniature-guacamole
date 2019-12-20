import fetch from 'isomorphic-unfetch';

export type Success = {
  data?: any[];
  next: string;
  errors: never;
};
export type ErrorType = {
  data: never;
  next: never;
  errors: {
    id: string;
    title: string;
    detail: string;
    status: string;
    code: string;
    source: { [key: string]: string };
  }[];
};

const fetchMusic = async (
  input: string,
  devToken: string,
  musicUserToken: string
) => {
  const headers = {
    Authorization: `Bearer ${devToken}`,
    'Music-User-Token': musicUserToken,
  };

  const promise = await fetch(`${process.env.MUSIC}${input}`, { headers });

  return promise.json();
};

export { fetchMusic };
