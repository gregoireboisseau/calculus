import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Calculus',
  description: 'Le jeu de calcul mental quotidien · The daily mental math game',
  alternates: {
    languages: { fr: '/fr', en: '/en' },
  },
};

export default function RootPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        gap: 32,
        background: 'var(--bg-page)',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-geist, system-ui, sans-serif)',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.3em',
          color: 'var(--text-brand)',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        CALCULUS
      </h1>

      <div style={{ display: 'flex', gap: 20 }}>
        <Link
          href="/fr"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 8,
            background: 'var(--calc-body)',
            boxShadow:
              'inset 0 1px 0 var(--calc-hi), inset -1px 0 0 var(--calc-hi), inset 0 -1px 0 var(--calc-lo), 0 4px 0 var(--calc-lo), 0 6px 12px rgba(0,0,0,0.3)',
            textDecoration: 'none',
            fontSize: 36,
            transition: 'transform 55ms ease, box-shadow 55ms ease',
          }}
          aria-label="Jouer en français"
        >
          🇫🇷
        </Link>

        <Link
          href="/en"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 8,
            background: 'var(--calc-body)',
            boxShadow:
              'inset 0 1px 0 var(--calc-hi), inset -1px 0 0 var(--calc-hi), inset 0 -1px 0 var(--calc-lo), 0 4px 0 var(--calc-lo), 0 6px 12px rgba(0,0,0,0.3)',
            textDecoration: 'none',
            fontSize: 36,
            transition: 'transform 55ms ease, box-shadow 55ms ease',
          }}
          aria-label="Play in English"
        >
          🇬🇧
        </Link>
      </div>
    </div>
  );
}
