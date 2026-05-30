'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function LegalModal() {
  const t = useTranslations('legal');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 10,
          letterSpacing: '0.12em',
          opacity: 0.4,
          color: 'inherit',
          padding: '4px 8px',
          fontFamily: 'inherit',
        }}
      >
        {t('link')}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--calc-body)',
              border: '2px solid var(--calc-edge)',
              borderRadius: 12,
              padding: '24px 28px',
              maxWidth: 340,
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              color: 'var(--lcd-active)',
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', opacity: 0.55, marginBottom: 16 }}>
              {t('title').toUpperCase()}
            </p>

            <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>
              <p style={{ marginBottom: 8 }}>
                <span style={{ opacity: 0.55, fontSize: 11, letterSpacing: '0.1em' }}>{t('hosting').toUpperCase()}</span>
                <br />
                <a
                  href="https://www.netlify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--lcd-active)', textDecoration: 'underline', opacity: 0.9 }}
                >
                  Netlify
                </a>
              </p>
              <p>
                <span style={{ opacity: 0.55, fontSize: 11, letterSpacing: '0.1em' }}>{t('developer').toUpperCase()}</span>
                <br />
                <a
                  href="https://github.com/gregoireboisseau"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--lcd-active)', textDecoration: 'underline', opacity: 0.9 }}
                >
                  Grégoire Boisseau
                </a>
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '8px 0',
                background: 'var(--calc-edge)',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--lcd-active)',
                opacity: 0.8,
                fontFamily: 'inherit',
              }}
            >
              {t('close').toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
