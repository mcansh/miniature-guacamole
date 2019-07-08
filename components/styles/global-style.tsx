import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* stylelint-disable-next-line property-no-unknown */
    color-scheme: light dark;
  }

  html {
    font-size: 10px;
    box-sizing: border-box;
    text-size-adjust: 100%;
  }

  * {
    box-sizing: inherit;
    margin: 0;
  }

  body {
    font-family: ${props => props.theme.fontStack};
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
