import React from 'react';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Portal from '@reach/portal';
import { useSpring, animated } from 'react-spring';
import GlobalStyle from './styles/global-style';
import MiniPlayer from './miniplayer';
import theme from '~/config';

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
  MusicKit: any;
}

const Layout = ({ children, MusicKit }: LayoutProps) => {
  const { pathname } = useRouter();
  const [miniplayerOpen, setMiniplayerOpen] = React.useState(false);

  const zoom = useSpring({
    transform: `scale(${miniplayerOpen ? 0.95 : 1})`,
  });

  React.useEffect(() => {
    const sw = async () => {
      if (process.env.NODE_ENV === 'production') {
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully');
          } catch (error) {
            console.warn('Service Worker failed to register');
          }
        }
      }
    };
    sw();
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
        <animated.div style={zoom}>{children}</animated.div>
        {pathname !== '/login' && (
          <Portal>
            <MiniPlayer
              miniplayerOpen={miniplayerOpen}
              setMiniplayerOpen={setMiniplayerOpen}
              MusicKit={MusicKit}
            />
          </Portal>
        )}
      </>
    </ThemeProvider>
  );
};

export default Layout;
