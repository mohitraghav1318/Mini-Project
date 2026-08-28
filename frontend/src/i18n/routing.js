import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // the two languages the site supports
  locales: ['hi', 'en'],
  // Hindi is the default — matches your "always default to Hindi" decision
  defaultLocale: 'hi',
});