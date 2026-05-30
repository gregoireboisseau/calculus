export function computeScore(tempsPasse: number, ecart: number): number {
  const tempsRestant = 100 - tempsPasse;
  if (tempsRestant <= 0) return 0;
  return Math.round(1000 * (tempsRestant / 100)) - ecart;
}
