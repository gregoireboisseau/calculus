import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip root (/), api, static files — only handle locale-prefixed routes
  matcher: ['/(fr|en)', '/(fr|en)/:path*'],
};
