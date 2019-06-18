import { MediaItem } from '~/types';

function artworkForMediaItem(item: MediaItem | undefined, size: number) {
  if (!item) {
    return `https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/${size}x${size}bb.jpeg`;
  }

  return item.attributes.artwork.url.replace(/{w}|{h}/g, String(size));
}

export { artworkForMediaItem };
