import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faForward, faPlay } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { ellipsis, rgba } from 'polished';
import { artworkForMediaItem } from '~/utils';

const MiniPlayerStyles = styled.footer`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  display: grid;
  grid-template-columns: 5.5rem 1fr auto;
  align-items: center;
  grid-gap: 0 1rem;

  @media (prefers-color-scheme: dark) {
    background: ${rgba('#1a1a1a', 0.8)};
  }

  img {
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 0.8vw;
  }

  p {
    font-size: 1.6rem;
    flex-grow: 1;
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
  const player =
    music && music.player && music.player.queue.length > 0
      ? music.player
      : {
          nowPlayingItem: {
            artworkURL: artworkForMediaItem(undefined, 100),
            attributes: { name: 'Not Playing' },
          },
          player: { isPlaying: false },
        };

  const playbackStateDidChange = (data: any) => {
    console.log(data);
  };

  React.useEffect(() => {
    if (music) {
      music.addEventListener(
        MusicKit.Events.playbackStateDidChange,
        playbackStateDidChange
      );
      return () =>
        music.removeEventListener(
          MusicKit.Events.playbackStateDidChange,
          playbackStateDidChange
        );
    }
    return () => {};
  });

  return (
    <MiniPlayerStyles>
      <img
        src={player.nowPlayingItem.artworkURL}
        alt={player.nowPlayingItem.attributes.name}
      />
      <p>{player.nowPlayingItem.attributes.name}</p>
      <div>
        <button
          type="button"
          disabled={player.nowPlayingItem.attributes.name === 'Not Playing'}
          onClick={async () =>
            player.isPlaying ? music.pause() : music.play()
          }
        >
          <FontAwesomeIcon icon={player.isPlaying ? faPause : faPlay} />
        </button>
        <button
          type="button"
          disabled={player.nowPlayingItem.attributes.name === 'Not Playing'}
        >
          <FontAwesomeIcon icon={faForward} />
        </button>
      </div>
    </MiniPlayerStyles>
  );
};

export default MiniPlayer;
