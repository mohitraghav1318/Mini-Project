import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Mukta } from 'next/font/google';
import '../globals.scss';

import Navbar from '@/components/Navbar/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import getRequestConfig from '@/i18n/request.js';

// Mukta-only per the font decision — Rozha One dropped since its
// Devanagari support was unconfirmed and it fought the simple-theme goal.
// Devanagari subset added so Hindi text renders correctly.
// Both --font-body and --font-display point at Mukta, in case existing
// SCSS still references --font-display anywhere — headings differentiate
// via weight/size instead of a second typeface.
const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
});

export default async function LocaleLayout({ children, params }) {
  console.log(`LocaleLayout: top of function, params:`, params);
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Call the request config function directly to get the messages for the locale
  const { messages } = await getRequestConfig({
    requestLocale: Promise.resolve(locale)
  });

  console.log(`LocaleLayout: locale=${locale}, messages=`);
  console.log(messages);

  return (
    <html lang={locale} className={mukta.variable}>
      <body style={{ '--font-display': 'var(--font-body)' }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}