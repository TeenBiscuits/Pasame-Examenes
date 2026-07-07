export function roundPoints(points: number) {
  return Math.round((points + Number.EPSILON) * 1000) / 1000;
}

export function formatPoints(points: number) {
  return roundPoints(points).toString();
}
