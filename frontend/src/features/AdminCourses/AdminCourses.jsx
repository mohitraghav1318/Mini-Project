"use client";

import { useTranslations } from "next-intl";
import CourseForm from "./components/CourseForm/CourseForm";
import styles from "./AdminCourses.module.scss";
import { ADMIN_COURSES_NAMESPACE, LOADING_MESSAGE } from "./data";
import { useAdminCourses } from "./hooks/useAdminCourses";

export default function AdminCourses() {
  const { user, isLoading } = useAdminCourses();
  const t = useTranslations(ADMIN_COURSES_NAMESPACE);

  if (isLoading) {
    return <p className={styles.loading} role="status">{LOADING_MESSAGE}</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <main className={styles.page}>
      <h1>{t("title")}</h1>
      <CourseForm />
    </main>
  );
}