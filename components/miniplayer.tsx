import React from 'react';
import styled from 'styled-components';
import { ellipsis } from 'polished';
import { animated, config, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faForward, faPlay } from '@fortawesome/free-solid-svg-icons';
import { artworkForMediaItem } from '~/utils';

const OPEN = 1;
const CLOSED = 85;

const MiniPlayerStyles = styled(animated.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  flex: 1;
  background-image: linear-gradient(#1a1a1a, #000);
  padding: 2.4rem;
  user-select: none;
  min-height: 110%;

  .miniplayer__nub {
    position: absolute;
    width: 5rem;
    height: 0.4rem;
    background-color: rgba(220, 220, 220, 0.4);
    top: 1.2rem;
    border-radius: 0.4rem;
    margin: 0 auto;
    left: 0;
    right: 0;
  }

  .miniplayer__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
    height: 100%;
  }

  img,
  h1,
  h2 {
    width: 100%;
  }

  img {
    margin-bottom: 2rem;
    border-radius: 0.8vw;
    pointer-events: none;
  }

  .miniplayer__artist-name {
    color: #e94b63;
  }

  h1 {
    font-size: 1.6rem;
    ${ellipsis()}
  }

  button {
    background: transparent;
    color: black;
    border: none;
    font-size: 2rem;

    @media (prefers-color-scheme: dark) {
      color: white;
    }
  }
`;

const MiniPlayer = ({ MusicKit }: { MusicKit: any }) => {
  const music = MusicKit && MusicKit.getInstance();
  const [nowPlayingItem, setNowPlayingItem] = React.useState({
    artworkURL: artworkForMediaItem(undefined, 600),
    attributes: { name: 'Not Playing', artistName: null },
  });
  const player = music && music.player;

  const mediaItemDidChange = (data: any) => {
    console.log(data.item);

    setNowPlayingItem(data.item);
  };

  React.useEffect(() => {
    if (music) {
      music.addEventListener(
        MusicKit.Events.mediaItemDidChange,
        mediaItemDidChange
      );
      return () =>
        music.removeEventListener(
          MusicKit.Events.mediaItemDidChange,
          mediaItemDidChange
        );
    }
    return () => {};
  });

  const [{ y, radius }, set] = useSpring(() => ({
    y: CLOSED,
    radius: 0,
  }));
  const bind = useGesture(({ delta: [, yAxis] }) => {
    if (yAxis > 0) {
      enableBodyScroll(document.body);
    } else {
      disableBodyScroll(document.body);
    }
    set({
      y: yAxis > 50 ? CLOSED : OPEN,
      radius: yAxis > 50 ? 0 : 2,
      config: { ...config.default, clamp: true },
    });
  });

  React.useEffect(() => () => clearAllBodyScrollLocks(), []);

  return (
    <MiniPlayerStyles
      {...bind()}
      style={{
        transform: y.interpolate(yAxis => `translate3d(0,${yAxis}%,0)`),
        borderTopLeftRadius: radius.interpolate(r => `${r}vw`),
        borderTopRightRadius: radius.interpolate(r => `${r}vw`),
      }}
    >
      <div className="miniplayer__nub" />
      <div className="miniplayer__content">
        <img
          src={nowPlayingItem.artworkURL}
          alt={nowPlayingItem.attributes.name}
        />
        <h1 className="miniplayer__track-name">
          {nowPlayingItem.attributes.name}
        </h1>
        <h2 className="miniplayer__artist-name">
          {nowPlayingItem.attributes.artistName}
        </h2>
        <div>
          <button
            type="button"
            disabled={nowPlayingItem.attributes.name === 'Not Playing'}
            onClick={async () =>
              player && player.isPlaying ? music.pause() : music.play()
            }
          >
            <FontAwesomeIcon
              icon={player && player.isPlaying ? faPause : faPlay}
            />
          </button>
          <button
            type="button"
            disabled={nowPlayingItem.attributes.name === 'Not Playing'}
            onClick={async () => player && player.skipToNextItem()}
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      </div>
    </MiniPlayerStyles>
  );
};

export default MiniPlayer;
