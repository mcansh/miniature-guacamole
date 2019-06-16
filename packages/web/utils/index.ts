interface MediaItem {
  attributes: {
    artwork: {
      url: string;
      height: number;
      width: number;
    };
  };
}

type MediaItemOrUndefined = MediaItem | undefined;

function artworkForMediaItem(item: MediaItemOrUndefined, size: number) {
  if (!item) {
    return `https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/${size}x${size}bb.jpeg`;
  }

  return item.attributes.artwork.url.replace(/{w}|{h}/g, String(size));
}

const RepeatModeNone = 0;
const RepeatModeOne = 1;
const RepeatModeAll = 2;

const ShuffleModeOff = 0;
const ShuffleModeSongs = 1;

export {
  artworkForMediaItem,
  RepeatModeNone,
  RepeatModeOne,
  RepeatModeAll,
  ShuffleModeOff,
  ShuffleModeSongs,
};
