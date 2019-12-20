// To parse this data:
//
//   import { Convert, Album } from "./file";
//
//   const album = Convert.toAlbum(json);

export interface AlbumResponse {
  data?: AlbumDatum[];
}

export interface AlbumDatum {
  id?: string;
  type?: string;
  href?: string;
  attributes?: PurpleAttributes;
  relationships?: Relationships;
}

export interface PurpleAttributes {
  artistName?: string;
  playParams?: PurplePlayParams;
  artwork?: Artwork;
  name?: string;
  dateAdded?: Date;
  trackCount?: number;
}

export interface Artwork {
  width?: number;
  height?: number;
  url?: string;
}

export interface PurplePlayParams {
  id?: string;
  kind?: string;
  isLibrary?: boolean;
}

export interface Relationships {
  tracks?: Tracks;
}

export interface Tracks {
  data?: TracksDatum[];
  href?: string;
  meta?: Meta;
}

export interface TracksDatum {
  id?: string;
  type?: string;
  href?: string;
  attributes?: FluffyAttributes;
}

export interface FluffyAttributes {
  artwork?: Artwork;
  artistName?: string;
  genreNames?: string[];
  durationInMillis?: number;
  releaseDate?: Date;
  name?: string;
  albumName?: string;
  playParams?: FluffyPlayParams;
  trackNumber?: number;
  contentRating?: string;
}

export interface FluffyPlayParams {
  id?: string;
  kind?: string;
  isLibrary?: boolean;
  reporting?: boolean;
  catalogId?: string;
}

export interface Meta {
  total?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toAlbum(json: string): Album {
    return JSON.parse(json);
  }

  public static albumToJson(value: Album): string {
    return JSON.stringify(value);
  }
}
