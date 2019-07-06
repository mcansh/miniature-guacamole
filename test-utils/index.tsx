import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render as rtlRender } from '@testing-library/react';
import theme from '~/config';
import GlobalStyle from '~/components/styles/global-style';

function render(component: React.ReactNode) {
  return {
    ...rtlRender(
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          {component}
        </>
      </ThemeProvider>
    ),
  };
}

export * from '@testing-library/react';
export { render };
