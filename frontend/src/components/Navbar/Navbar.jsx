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
    <header className={styles.header}>
      {/* Top strip */}
      <div className={styles.topStrip}>
        <span>🇮🇳 महिला सशक्तिकरण मंच — ग्रामीण महिलाओं के लिए</span>
      </div>

      {/* Main navbar */}
      <nav className={styles.navbar}>
        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden="true">🌸</span>
          <span className={styles.brandText}>{t('appName')}</span>
        </Link>

        {/* Nav links */}
        <div className={styles.navLinks}>
          <Link href="/courses" className={styles.navLink}>
            📚 {t('courses')}
          </Link>
        </div>

        {/* Right-side actions */}
        <div className={styles.actions}>
          <LanguageSwitcher />

          {isLoading ? null : user ? (
            <div className={styles.userSection}>
              <Link href="/dashboard" className={styles.userName}>
                👤 {user.name}
              </Link>
              <button className={styles.logoutBtn} onClick={logout}>
                {t('logout')}
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                {t('login')}
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}