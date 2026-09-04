import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// list every message file here as we add new ones —
// each filename becomes the namespace key components use,
// e.g. useTranslations('register') reads from register.json
const namespaces = ['common', 'occupations', 'states', 'register'];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  // load and merge all namespace files for this locale into one object
  const messages = {};
  for (const ns of namespaces) {
    messages[ns] = (await import(`../messages/${locale}/${ns}.json`)).default;
  }

  return { locale, messages };
});