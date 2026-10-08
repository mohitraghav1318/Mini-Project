"use client";

import { ArrowDown, ArrowRight, Heart, BookOpen, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Hero.module.scss";

export default function Hero() {
  const t = useTranslations("home.hero");
  const { user, isLoading } = useAuth();

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <Heart size={16} fill="currentColor" />{" "}
          {!isLoading && user ? t("welcomeUser", { name: user.name }) : t("eyebrow")}
        </p>

        <h1>{t("title")}</h1>
        <p className={styles.description}>{t("description")}</p>

        <div className={styles.actions}>
          {!isLoading && user ? (
            <>
              <Link href="/courses" className={styles.primary}>
                {t("exploreCourses")} <BookOpen size={18} />
              </Link>
              <Link href="/dashboard" className={styles.secondary}>
                {t("goToDashboard")} <LayoutDashboard size={18} />
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className={styles.primary}>
                {t("primary")} <ArrowRight size={18} />
              </Link>
              <a href="#how-to-join" className={styles.secondary}>
                {t("secondary")} <ArrowDown size={17} />
              </a>
            </>
          )}
        </div>

        <div className={styles.stats}>
          <span>{t("statOne")}</span>
          <i />
          <span>{t("statTwo")}</span>
        </div>
      </div>

      <div className={styles.art} aria-hidden="true">
        <div className={styles.sun} />
        <div className={styles.hillOne} />
        <div className={styles.hillTwo} />
        <div className={styles.flower}>✦</div>
        <div className={styles.leaf}>❋</div>
        <div className={styles.badge}>
          साथ<br />सशक्त
        </div>
      </div>
    </section>
  );
}

