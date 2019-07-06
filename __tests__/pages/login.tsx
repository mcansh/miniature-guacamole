import React from 'react';
import { render } from '~/test-utils';
import Login from '~/pages/login';

it('renders the login button', () => {
  const { getByText } = render(<Login MusicKit={{}} />);
  expect(getByText(/sign in to apple music/i)).toBeInTheDocument();
});
