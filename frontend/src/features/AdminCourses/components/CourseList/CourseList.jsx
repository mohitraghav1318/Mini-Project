"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import LessonForm from "../LessonForm/LessonForm";
import styles from "./CourseList.module.scss";
import { useCourseList } from "./hooks/useCourseList";

export default function CourseList({ refreshTrigger, onLessonAdded }) {
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const t = useTranslations("adminCourses");
  const tOccupations = useTranslations("occupations");
  const { courses, isLoading, error } = useCourseList(refreshTrigger);

  if (isLoading) {
    return <p className={styles.status} role="status">{t("list.loading")}</p>;
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  if (courses.length === 0) {
    return <p className={styles.status}>{t("list.empty")}</p>;
  }

  function handleLessonAdded() {
    setExpandedCourseId(null);
    onLessonAdded?.();
  }

  return (
    <section className={styles.list} aria-label={t("list.heading")}>
      {courses.map((course) => {
        const lessonCount = course.lessons?.length ?? 0;
        const category = OCCUPATION_KEYS.includes(course.category)
          ? tOccupations(course.category)
          : course.category;

        return (
          <article className={styles.card} key={course.id}>
            <div className={styles.cardHeader}>
              <h2>{course.title}</h2>
              <span className={styles.category}>{category}</span>
            </div>
            <p className={styles.description}>{course.description}</p>
            <p className={styles.lessonCount}>
              {lessonCount} {lessonCount === 1 ? t("list.lesson") : t("list.lessons")}
            </p>
            <Button
              type="button"
              className={styles.lessonButton}
              onClick={() => setExpandedCourseId(
                expandedCourseId === course.id ? null : course.id,
              )}
            >
              {expandedCourseId === course.id
                ? t("list.hideLessonForm")
                : t("list.addLesson")}
            </Button>
            {expandedCourseId === course.id && (
              <LessonForm
                courseId={course.id}
                onLessonAdded={handleLessonAdded}
              />
            )}
          </article>
        );
      })}
    </section>
  );
}