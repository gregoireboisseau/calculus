const POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100] as const;
const DRAW_COUNT = 6;

// Mulberry32 — fast, high-quality seeded PRNG
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = Math.imul(31, hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface DailyDraw {
  numbers: number[];
  target: number;
  date: string;
}

export function getDailyDraw(dateStr: string): DailyDraw {
  const rand = mulberry32(dateToSeed(dateStr));

  const numbers: number[] = [];
  for (let i = 0; i < DRAW_COUNT; i++) {
    numbers.push(POOL[Math.floor(rand() * POOL.length)]);
  }

  const target = 100 + Math.floor(rand() * 900);

  return { numbers, target, date: dateStr };
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}
