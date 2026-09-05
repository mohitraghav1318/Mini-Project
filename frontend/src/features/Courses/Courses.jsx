"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import styles from "./Courses.module.scss";
import { useCourses } from "./hooks/useCourses";

export default function Courses() {
  const t = useTranslations("courses");
  const tOccupations = useTranslations("occupations");
  const router = useRouter();
  const { courses, isLoading, error } = useCourses();

  if (isLoading) {
    return <p className={styles.status} role="status">{t("loading")}</p>;
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  if (courses.length === 0) {
    return <p className={styles.status}>{t("empty")}</p>;
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t("title")}</h1>
      <section className={styles.grid} aria-label={t("title")}>
        {courses.map((course) => {
          const lessonCount = course.lessons?.length ?? 0;
          const category = OCCUPATION_KEYS.includes(course.category)
            ? tOccupations(course.category)
            : course.category;

          return (
            <button
              type="button"
              className={styles.card}
              key={course.id}
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <span className={styles.cardTitle}>{course.title}</span>
              <span className={styles.category}>{category}</span>
              <span className={styles.lessonCount}>
                {lessonCount} {lessonCount === 1 ? t("lesson") : t("lessons")}
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}