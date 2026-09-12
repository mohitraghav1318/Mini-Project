import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // run on all routes except static files, api routes, and Next internals
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};