"use client";

import styles from './Navbar.module.scss';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const t = useTranslations('common');
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        {t('appName')}
      </Link>

      <div className={styles.actions}>
        <LanguageSwitcher />

        {isLoading ? null : user ? (
          <div className={styles.userSection}>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={logout}>
              {t('logout')}
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.getStarted}>
            {t('getStarted')}
          </Link>
        )}
      </div>
    </nav>
  );
}