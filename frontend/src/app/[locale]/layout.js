import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Mukta } from 'next/font/google';
import '../globals.scss';

import Navbar from '@/components/Navbar/Navbar';
import { AuthProvider } from '@/context/AuthContext';

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
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
  <html lang={locale} className={mukta.variable}>
    <body style={{ '--font-display': 'var(--font-body)' }}>
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </NextIntlClientProvider>
    </body>
  </html>
);
}