import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localeDetection: true, // redirect based on Accept-Language header
});

export type Locale = (typeof routing.locales)[number];
