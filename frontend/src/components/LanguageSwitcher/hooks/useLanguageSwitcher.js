import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

// Reads the current locale and gives back a function to switch it,
// while staying on the same page (locale-aware router handles the path swap)
export function useLanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (nextLocale) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  return { locale, switchTo };
}