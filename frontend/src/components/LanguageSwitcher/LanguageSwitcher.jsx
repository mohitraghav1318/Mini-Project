'use client';

import styles from './LanguageSwitcher.module.scss';
import { languages } from './data/languages';
import { useLanguageSwitcher } from './hooks/useLanguageSwitcher';

export default function LanguageSwitcher() {
  const { locale, switchTo } = useLanguageSwitcher();

  return (
    <div className={styles.switcher} role="group" aria-label="Language switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`${styles.option} ${locale === lang.code ? styles.active : ''}`}
          onClick={() => switchTo(lang.code)}
          aria-pressed={locale === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}