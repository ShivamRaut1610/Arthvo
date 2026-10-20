export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Naya Arthvo',
  2: 'Seekhta Arthvo',
  3: 'Samajhta Arthvo',
  4: 'Badhta Arthvo',
  5: 'Pakka Arthvo',
  6: 'Sachha Arthvo',
  7: 'Poora Arthvo',
};

export function getLevelFromXP(xp: number): number {
  if (xp < 500) return 1;
  if (xp < 1500) return 2;
  if (xp < 3500) return 3;
  if (xp < 7500) return 4;
  if (xp < 15000) return 5;
  if (xp < 30000) return 6;
  return 7;
}

export function getXPForNextLevel(level: number): number {
  const thresholds = [0, 500, 1500, 3500, 7500, 15000, 30000, 99999];
  return thresholds[Math.min(level, 7)];
}
