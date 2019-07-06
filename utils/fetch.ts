import fetch from 'isomorphic-unfetch';

const fetchMusic = async (
  input: string,
  devToken: string,
  musicUserToken: string
) => {
  const defaultHeaders = {
    Authorization: `Bearer ${devToken}`,
    'Music-User-Token': musicUserToken,
  };

  try {
    const promise = await fetch(`${process.env.MUSIC}${input}`, {
      headers: {
        ...defaultHeaders,
      },
    });

    if (!promise.ok) {
      throw new Error('An error occured');
    }

    return promise;
  } catch (error) {
    throw new Error(error);
  }
};

export { fetchMusic };
