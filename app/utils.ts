export function fmtMSS(input: number) {
  let minutes = Math.floor(input / 60);
  let seconds = String(input - minutes * 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
