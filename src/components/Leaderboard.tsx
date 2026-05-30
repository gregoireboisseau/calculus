'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getLeaderboard } from '@/app/actions/score';
import type { LeaderboardResult, ScoreRow } from '@/app/actions/score';
import { getTodayString } from '@/lib/game/draw';

interface LeaderboardProps {
  date: string;          // initial date (today's game date)
  currentPseudo?: string;
  currentScore?: number;
  locale?: string;
}

function formatDate(dateStr: string, locale = 'fr-FR'): string {
  const [y, m, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, day));
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', timeZone: 'UTC' });
}

function shiftDay(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
}

const prevDay = (d: string) => shiftDay(d, -1);
const nextDay = (d: string) => shiftDay(d, +1);

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function TableRow({ row, rank, isMe }: { row: ScoreRow; rank: number; isMe: boolean }) {
  return (
    <tr
      className={isMe ? 'anim-slide' : ''}
      style={{
        background: isMe ? 'rgba(0,200,60,0.09)' : 'transparent',
        fontWeight: isMe ? 700 : 400,
      }}
    >
      <td style={{ padding: '5px 6px', textAlign: 'center', opacity: 0.55, fontSize: 11 }}>
        {rank}
      </td>
      <td style={{ padding: '5px 6px', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {isMe ? `▶ ${row.pseudo}` : row.pseudo}
      </td>
      <td style={{ padding: '5px 6px', textAlign: 'center', fontFamily: 'monospace' }}>
        {row.score}
      </td>
      <td style={{ padding: '5px 6px', textAlign: 'center', fontFamily: 'monospace', opacity: 0.7 }}>
        {formatTime(row.temps_passe)}
      </td>
      <td style={{ padding: '5px 6px', textAlign: 'center', opacity: row.ecart === 0 ? 1 : 0.7 }}>
        {row.ecart === 0 ? '✓' : `±${row.ecart}`}
      </td>
    </tr>
  );
}

export function Leaderboard({ date: initialDate, currentPseudo, currentScore, locale }: LeaderboardProps) {
  const t = useTranslations('game');
  const today = getTodayString();
  const [activeDate, setActiveDate] = useState(initialDate);
  const [data, setData] = useState<LeaderboardResult | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (d: string) => {
      setLoading(true);
      try {
        const isToday = d === initialDate;
        const result = await getLeaderboard(
          d,
          isToday ? currentPseudo : undefined,
          isToday ? currentScore : undefined,
        );
        setData(result);
      } catch {
        setData({ rows: [] });
      } finally {
        setLoading(false);
      }
    },
    [initialDate, currentPseudo, currentScore],
  );

  useEffect(() => {
    load(activeDate);
  }, [activeDate, load]);

  const canGoNext = activeDate < today;

  const navBtn: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: 'var(--lcd-active)',
    padding: '2px 10px',
  };

  const intlLocale = locale === 'en' ? 'en-GB' : 'fr-FR';

  return (
    <div>
      {/* Date navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button style={navBtn} onClick={() => setActiveDate(prevDay(activeDate))} aria-label="Jour précédent">
          ◀
        </button>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', opacity: 0.65 }}>
          {activeDate === today
            ? t('today').toUpperCase()
            : formatDate(activeDate, intlLocale).toUpperCase()}
        </span>
        <button
          style={{ ...navBtn, opacity: canGoNext ? 1 : 0.2, cursor: canGoNext ? 'pointer' : 'default' }}
          onClick={() => canGoNext && setActiveDate(nextDay(activeDate))}
          disabled={!canGoNext}
          aria-label="Jour suivant"
        >
          ▶
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', opacity: 0.35, fontSize: 12, padding: '12px 0' }}>
          {t('loading')}
        </p>
      ) : !data || data.rows.length === 0 ? (
        <p style={{ textAlign: 'center', opacity: 0.35, fontSize: 12, padding: '12px 0' }}>
          {t('noScores')}
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {[['#', '#'], ['colPlayer', t('colPlayer')], ['score', t('score')], ['colDuration', t('colDuration')], ['colGap', t('colGap')]].map(([key, label]) => (
                  <th
                    key={key}
                    style={{
                      padding: '4px 6px',
                      textAlign: key === '#' || key === 'score' || key === 'colDuration' || key === 'colGap'
                        ? 'center'
                        : 'left',
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      borderBottom: '1px solid currentColor',
                      opacity: 0.4,
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => {
                const isMe =
                  row.pseudo === currentPseudo &&
                  (activeDate !== initialDate || currentScore == null || row.score === currentScore);
                return <TableRow key={i} row={row} rank={i + 1} isMe={isMe} />;
              })}

              {/* Player ranked outside top 100 — today only */}
              {data.playerEntry && (
                <>
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: '4px 0', textAlign: 'center', opacity: 0.25, fontSize: 10, letterSpacing: '0.2em' }}
                    >
                      · · ·
                    </td>
                  </tr>
                  <TableRow row={data.playerEntry} rank={data.playerEntry.rank} isMe={true} />
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
