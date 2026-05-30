import { cookies } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDailyDraw, getTodayString } from '@/lib/game/draw';
import { Calculator } from '@/components/Calculator/Calculator';
import { Leaderboard } from '@/components/Leaderboard';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GamePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const today = getTodayString();
  const draw = getDailyDraw(today);
  const t = await getTranslations('game');

  const cookieStore = await cookies();
  const playedCookie = cookieStore.get(`calculus_played_${today}`);

  if (playedCookie) {
    let played: { pseudo: string; score: number; ecart: number; tempsRestant: number };
    try {
      played = JSON.parse(playedCookie.value);
    } catch {
      played = { pseudo: '?', score: 0, ecart: 999, tempsRestant: 0 };
    }

    return (
      <div
        style={{
          maxWidth: 380,
          width: '100%',
          background: `
            radial-gradient(ellipse at 28% 16%, var(--calc-hi) 0%, transparent 52%),
            linear-gradient(168deg, var(--calc-hi) 0%, var(--calc-body) 38%, var(--calc-edge) 100%)
          `,
          boxShadow: `
            0 0 0 2px var(--calc-edge),
            0 10px 28px rgba(0,0,0,0.42),
            inset 0 1px 0 var(--calc-hi)
          `,
          borderRadius: '14px 14px 28px 28px',
          padding: '16px 16px 22px',
          color: 'var(--lcd-active)',
        }}
      >
        {/* Solar panel header */}
        <div
          style={{
            width: 70,
            height: 22,
            borderRadius: 3,
            marginBottom: 12,
            background: `
              repeating-linear-gradient(90deg,
                transparent 0px, transparent 12px,
                rgba(0,0,0,0.6) 12px, rgba(0,0,0,0.6) 13px),
              repeating-linear-gradient(0deg,
                transparent 0px, transparent 3px,
                rgba(0,0,0,0.35) 3px, rgba(0,0,0,0.35) 4px),
              linear-gradient(140deg, #1a2e1a 0%, #0e180e 100%)
            `,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.5)',
          }}
        />

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', opacity: 0.55, marginBottom: 8 }}>
          {t('alreadyPlayedTitle').toUpperCase()}
        </p>

        {/* Score */}
        <div
          style={{
            background: 'var(--lcd-bg)',
            border: '2px solid var(--lcd-bezel)',
            borderRadius: 6,
            padding: '14px 16px',
            marginBottom: 12,
            textAlign: 'center',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.55, marginBottom: 4 }}>
            {t('yourScoreWith', { pseudo: played.pseudo }).toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: 'DSEG7Classic, monospace',
              fontSize: 36,
              color: 'var(--lcd-active)',
            }}
          >
            {played.score}
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6, fontFamily: 'monospace' }}>
            {t('targetEcart', { target: draw.target, ecart: played.ecart === 999 ? '—' : played.ecart })}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', opacity: 0.55, marginBottom: 6, textAlign: 'center' }}>
          {t('leaderboardTitle').toUpperCase()}
        </div>
        <Leaderboard date={today} currentPseudo={played.pseudo} currentScore={played.score} locale={locale} />
      </div>
    );
  }

  return <Calculator draw={draw} locale={locale} />;
}
