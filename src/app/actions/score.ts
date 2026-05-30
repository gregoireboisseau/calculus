'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export interface ScoreRow {
  pseudo: string;
  score: number;
  temps_passe: number;
  ecart: number;
}

export interface LeaderboardResult {
  rows: ScoreRow[];
  // Set only when the current player is outside the top 100
  playerEntry?: ScoreRow & { rank: number };
}

export async function submitScore(
  pseudo: string,
  score: number,
  date: string,
  tempsPasse: number,
  ecart: number,
  locale: string,
): Promise<void> {
  const cookieStore = await cookies();

  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  cookieStore.set(`calculus_played_${date}`, JSON.stringify({ pseudo, score, ecart, tempsPasse }), {
    expires: midnight,
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  });

  if (tempsPasse <= 0) return;

  try {
    await db.execute({
      sql: `INSERT INTO scores (pseudo, score, date, temps_passe, ecart, locale) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [pseudo, score, date, tempsPasse, ecart, locale],
    });
  } catch (err) {
    console.error('[submitScore]', err);
  }
}

export async function getLeaderboard(
  date: string,
  currentPseudo?: string,
  currentScore?: number,
): Promise<LeaderboardResult> {
  try {
    const result = await db.execute({
      sql: `SELECT pseudo, score, temps_passe, ecart FROM scores WHERE date = ? ORDER BY score DESC LIMIT 100`,
      args: [date],
    });

    const rows: ScoreRow[] = result.rows.map((r) => ({
      pseudo: r.pseudo as string,
      score: r.score as number,
      temps_passe: r.temps_passe as number,
      ecart: r.ecart as number,
    }));

    // Check if current player is already in the top 100
    const playerInTop = currentPseudo != null && rows.some(
      (r) => r.pseudo === currentPseudo && (currentScore == null || r.score === currentScore),
    );

    if (playerInTop || currentPseudo == null || currentScore == null) {
      return { rows };
    }

    // Player is outside top 100 — find their rank and row
    const [rankResult, rowResult] = await Promise.all([
      db.execute({
        sql: `SELECT COUNT(*) + 1 AS rank FROM scores WHERE date = ? AND score > ?`,
        args: [date, currentScore],
      }),
      db.execute({
        sql: `SELECT pseudo, score, temps_passe, ecart FROM scores WHERE date = ? AND pseudo = ? AND score = ? LIMIT 1`,
        args: [date, currentPseudo, currentScore],
      }),
    ]);

    const rank = rankResult.rows[0]?.rank as number;
    const r = rowResult.rows[0];
    const playerRow: ScoreRow | undefined = r
      ? { pseudo: r.pseudo as string, score: r.score as number, temps_passe: r.temps_passe as number, ecart: r.ecart as number }
      : undefined;

    return {
      rows,
      playerEntry: playerRow ? { ...playerRow, rank } : undefined,
    };
  } catch (err) {
    console.error('[getLeaderboard]', err);
    return { rows: [] };
  }
}
