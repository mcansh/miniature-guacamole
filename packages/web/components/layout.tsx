import React from 'react';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import theme from '~/config';
import GlobalStyle from './styles/global-style';

const icons = [
  512,
  256,
  192,
  180,
  152,
  144,
  120,
  114,
  96,
  76,
  72,
  60,
  57,
  32,
  16,
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => console.log('Service Worker registered successfully'))
          .catch(() => console.warn('Service Worker failed to register'));
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <Head>
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <title>Miniature Guacamole 🥑</title>
          <meta
            name="viewport"
            content="width=device-width,minimum-scale=1,initial-scale=1"
          />
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#6c16c7" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          {/* Touch icon for iOS 2.0+ and Android 2.1+ */}
          <link rel="apple-touch-icon-precomposed" href="/favicon.png" />
          {/* E 10 Metro tile icon (Metro equivalent of apple-touch-icon) */}
          <meta name="msapplication-TileColor" content="#7d69fc" />
          <meta name="msapplication-TileImage" content="/favicon.png" />
          {/* IE 11 Tile for Windows 8.1 Start Screen */}
          <meta name="application-name" content="Miniature Guacamole 🥑" />
          <meta name="msapplication-tooltip" content="Tooltip" />
          <meta name="msapplication-config" content="/ieconfig.xml" />
          {icons.map(icon => (
            <link
              key={icon}
              rel="icon"
              href={`/favicon-${icon}x${icon}.png`}
              sizes={`${icon}x${icon}`}
            />
          ))}
          {/* Favicon Chrome for Android */}
          {icons.map(icon => (
            <link
              key={icon}
              rel="shortcut icon"
              href={`/favicon-${icon}x${icon}.png`}
              sizes={`${icon}x${icon}`}
            />
          ))}
        </Head>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
};

export default Layout;
