import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light dark;
    --primary: ${props => props.theme.primary};
    --font-stack: ${props => props.theme.fontStack};
  }

  html {
    font-size: 62.5%;
    box-sizing: border-box;
    text-size-adjust: 100%;
  }

  * {
    box-sizing: inherit;
    margin: 0;
  }

  body {
    font-family: var(--font-stack);
    font-weight: 400;
    background: white;
    color: black;
    @media (prefers-color-scheme: dark) {
      background: black;
      color: white;
    }
  }

  input,
  textarea,
  keygen,
  select,
  button {
    font-size: inherit;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;
  }
`;

export default GlobalStyle;
