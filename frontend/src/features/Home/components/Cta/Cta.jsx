"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Cta.module.scss";

export default function Cta() {
  const t = useTranslations("home.cta");
  const { user, isLoading } = useAuth();

  return (
    <section className={styles.section}>
      <h2>{!isLoading && user ? t("loggedInTitle") : t("title")}</h2>
      <p>{!isLoading && user ? t("loggedInDescription") : t("description")}</p>
      {!isLoading && user ? (
        <Link href="/courses">
          {t("exploreCourses")} <BookOpen size={18} />
        </Link>
      ) : (
        <Link href="/register">
          {t("button")} <ArrowRight size={18} />
        </Link>
      )}
    </section>
  );
}

