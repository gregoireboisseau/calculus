'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'calculus_pwa_dismiss';
const DISMISS_DAYS = 7;

// iOS share sheet icon
function ShareIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px 2px' }}
      aria-hidden
    >
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
      <rect x="2" y="11" width="20" height="11" rx="2" />
    </svg>
  );
}

export function InstallBanner() {
  const t = useTranslations('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Desktop: skip
    if (!window.matchMedia('(max-width: 1024px)').matches) return;

    // Dismissed recently
    const raw = localStorage.getItem(DISMISS_KEY);
    if (raw) {
      const days = (Date.now() - parseInt(raw, 10)) / 86_400_000;
      if (days < DISMISS_DAYS) return;
    }

    // iOS: no beforeinstallprompt — show manual instructions instead
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    if (ios) {
      setIsIos(true);
      setVisible(true);
      return;
    }

    // Android / Chrome: capture deferred install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setVisible(false);
    if (outcome === 'dismissed') {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (!visible) return null;

  return (
    <div
      role="complementary"
      aria-label={t('bannerTitle')}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--calc-body)',
        borderTop: '2px solid var(--calc-edge)',
        boxShadow: '0 -6px 28px rgba(0,0,0,0.22)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* App icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/icon-96.png"
        alt=""
        width={52}
        height={52}
        style={{ borderRadius: 14, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
      />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--lcd-active)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {t('bannerTitle')}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--text-label)', lineHeight: 1.35 }}>
          {isIos ? (
            <>{t('iosBefore')} <ShareIcon /> {t('iosAfter')}</>
          ) : (
            t('bannerSub')
          )}
        </p>
      </div>

      {/* Install button — Android only */}
      {!isIos && (
        <button
          onClick={handleInstall}
          style={{
            background: 'var(--btn-e-face)',
            color: 'var(--btn-e-text)',
            border: 'none',
            borderRadius: 9,
            padding: '9px 15px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}
        >
          {t('install')}
        </button>
      )}

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        aria-label={t('later')}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-label)',
          cursor: 'pointer',
          fontSize: 20,
          lineHeight: 1,
          padding: '4px 6px',
          flexShrink: 0,
          opacity: 0.7,
        }}
      >
        ✕
      </button>
    </div>
  );
}
