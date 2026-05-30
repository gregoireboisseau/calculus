import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN,
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudo TEXT NOT NULL,
      score INTEGER NOT NULL,
      date TEXT NOT NULL,
      temps_restant REAL NOT NULL,
      ecart INTEGER NOT NULL,
      locale TEXT NOT NULL DEFAULT 'fr',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}
