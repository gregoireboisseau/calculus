'use client';

import { useEffect } from 'react';

export function LangAttribute({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
