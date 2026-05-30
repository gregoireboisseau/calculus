'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Restore from localStorage only — no system preference detection.
  // The <script> in layout.tsx handles the no-flash restore.
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch (_) {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Mode clair' : 'Mode sombre'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        color: 'var(--text-label)',
        padding: '2px 4px',
        borderRadius: 3,
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: '0.05em',
      }}
    >
      {dark ? '◑' : '○'}
    </button>
  );
}
