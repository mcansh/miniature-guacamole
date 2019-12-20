function artworkForMediaItem(url: string | undefined, size: number): string {
  if (typeof url === 'string') {
    return url.replace(/{w}|{h}/g, String(size));
  }
  return `https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/${size}x${size}bb.jpeg`;
}

export { artworkForMediaItem };
