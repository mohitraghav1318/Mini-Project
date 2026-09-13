import { startTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

// Reads the current locale and gives back a function to switch it,
// while staying on the same page (locale-aware router handles the path swap).
// startTransition is required by next-intl v4 for locale switching to work.
export function useLanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (nextLocale) => {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return { locale, switchTo };
}