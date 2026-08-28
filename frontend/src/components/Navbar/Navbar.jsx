import styles from './Navbar.module.scss';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('common');

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        {t('appName')}
      </Link>

      <div className={styles.actions}>
        <LanguageSwitcher />

        <Link href="/login" className={styles.getStarted}>
          {t('getStarted')}
        </Link>
      </div>
    </nav>
  );
}