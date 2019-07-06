function fmtMSS(input: number) {
  const minutes = Math.floor(input / 60);
  const seconds = String(input - minutes * 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export { fmtMSS };
