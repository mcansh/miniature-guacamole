import fetch from 'isomorphic-unfetch';

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

  return promise;
};

export { fetchMusic };
