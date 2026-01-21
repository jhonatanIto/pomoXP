export function convertToLevel(totalxp) {
  const level = Math.floor(Math.sqrt(totalxp / 6));
  return Math.min(Math.max(level, 1), 999);
}
