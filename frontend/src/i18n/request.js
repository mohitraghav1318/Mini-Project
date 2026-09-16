import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import fs from 'fs';
import path from 'path';

// list every message file here as we add new ones —
// each filename becomes the namespace key components use,
// e.g. useTranslations('register') reads from register.json
const namespaces = ['common', 'occupations', 'states', 'register', 'dashboard', 'adminCourses', 'courses', 'community', 'login'];

export default getRequestConfig(async ({ requestLocale }) => {
  console.log(`request.js: top of function`);
  console.log(`request.js: requestLocale promise: ${requestLocale}`);
  let locale = await requestLocale;
  console.log(`request.js: resolved locale from requestLocale: ${locale}`);

  if (!locale || !routing.locales.includes(locale)) {
    console.log(`request.js: locale ${locale} is invalid, defaulting to ${routing.defaultLocale}`);
    locale = routing.defaultLocale;
  }

  // load and merge all namespace files for this locale into one object
  const messages = {};
  for (const ns of namespaces) {
    const filePath = path.join(process.cwd(), 'src', 'messages', locale, `${ns}.json`);
    console.log(`request.js: trying to load from ${filePath}`);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      console.log(`request.js: file content for ${ns}: ${fileContent.substring(0, 100)}`);
      const nsMessages = JSON.parse(fileContent);
      console.log(`request.js: typeof nsMessages: ${typeof nsMessages}`);
      console.log(`request.js: nsMessages as string: ${JSON.stringify(nsMessages)}`);
      messages[ns] = nsMessages;
      console.log(`request.js: loaded namespace ${ns} for locale ${locale}`);
      console.log(`request.js: messages[ns] as string: ${JSON.stringify(messages[ns])}`);
    } catch (error) {
      console.error(`request.js: failed to load namespace ${ns} for locale ${locale}:`, error);
      messages[ns] = {};
    }
  }

  console.log(`request.js: returning locale=${locale}, messages=`);
  console.log(`request.js: messages as string: ${JSON.stringify(messages)}`);

  return { locale, messages };
});