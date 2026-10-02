"use client";

import { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const t = useTranslations("common");
  const { user, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.brand} onClick={closeMenu}>
            <span className={styles.brandIcon} aria-hidden="true">🌾</span>
            <span>{t("appName")}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopActions}>
          <LanguageSwitcher />

          <Link href="/courses" className={styles.navLink}>
            {t("courses")}
          </Link>

          {!isLoading && (
            user ? (
              <div className={styles.userSection}>
                <Link href="/dashboard" className={styles.navLink}>
                  {t("dashboard")}
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin/courses" className={styles.adminBadge}>
                    {t("adminPanel")}
                  </Link>
                )}
                <span className={styles.userName} title={user.name}>
                  {user.name}
                </span>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={logout}
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className={styles.guestSection}>
                <Link href="/login" className={styles.loginLink}>
                  {t("login")}
                </Link>
                <Link href="/register" className={styles.getStartedBtn}>
                  {t("getStarted")}
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile Controls */}
        <div className={styles.mobileControls}>
          <div className={styles.mobileLangWrapper}>
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className={`${styles.hamburgerBtn} ${isMenuOpen ? styles.active : ""}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`${styles.mobileDrawerOverlay} ${isMenuOpen ? styles.open : ""}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      >
        <aside
          className={`${styles.mobileDrawer} ${isMenuOpen ? styles.open : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {user && (
            <div className={styles.drawerUserHeader}>
              <div className={styles.userAvatar}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className={styles.drawerUserInfo}>
                <span className={styles.drawerUserName}>{user.name}</span>
                {user.role === "ADMIN" && (
                  <span className={styles.drawerAdminTag}>{t("adminPanel")}</span>
                )}
              </div>
            </div>
          )}

          <div className={styles.drawerNavLinks}>
            <Link href="/" className={styles.drawerLink} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/courses" className={styles.drawerLink} onClick={closeMenu}>
              {t("courses")}
            </Link>

            {user && (
              <>
                <Link href="/dashboard" className={styles.drawerLink} onClick={closeMenu}>
                  {t("dashboard")}
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin/courses" className={styles.drawerLink} onClick={closeMenu}>
                    {t("adminPanel")}
                  </Link>
                )}
              </>
            )}
          </div>

          <div className={styles.drawerFooter}>
            {!isLoading && (
              user ? (
                <button
                  type="button"
                  className={styles.drawerLogoutBtn}
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  {t("logout")}
                </button>
              ) : (
                <div className={styles.drawerAuthGroup}>
                  <Link href="/login" className={styles.drawerLoginBtn} onClick={closeMenu}>
                    {t("login")}
                  </Link>
                  <Link href="/register" className={styles.drawerRegisterBtn} onClick={closeMenu}>
                    {t("getStarted")}
                  </Link>
                </div>
              )
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}