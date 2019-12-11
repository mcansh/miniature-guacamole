export interface Track {
  id: string;
  type: string;
  href: string;
  attributes: {
    name: string;
    trackNumber: number;
    durationInMillis: number;
    playParams: {
      id: string;
      kind: string;
      isLibrary: true;
      reporting: true;
      catalogId: string;
    };
    artwork: {
      width: number;
      height: number;
      url: string;
    };
    artistName: string;
    contentRating: string;
    albumName: string;
  };
}

export interface Album {
  data: {
    id: string;
    type: string;
    href: string;
    attributes: {
      name: string;
      trackCount: number;
      playParams: {
        id: string;
        kind: string;
        isLibrary: boolean;
      };
      artwork: {
        width: number;
        height: number;
        url: string;
      };
      artistName: string;
    };
    relationships: {
      tracks: {
        data: Track[];
        href: string;
      };
    };
  };
}

export interface MediaItem {
  attributes: {
    artwork: {
      url: string;
      height: number;
      width: number;
    };
  };
}
