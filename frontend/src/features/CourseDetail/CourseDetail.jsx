"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./CourseDetail.module.scss";
import { useCourseDetail } from "./hooks/useCourseDetail";

export default function CourseDetail({ courseId }) {
  const t = useTranslations("courses");
  const { course, isLoading, error } = useCourseDetail(courseId);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const lessons = useMemo(
    () => [...(course?.lessons || [])].sort((first, second) => first.order - second.order),
    [course],
  );

  if (isLoading) {
    return <p className={styles.status} role="status">{t("detail.loading")}</p>;
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  if (!course) {
    return <p className={styles.status}>{t("detail.notFound")}</p>;
  }

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </header>

      {selectedLesson ? (
        <section className={styles.learningArea}>
          <div className={styles.playerSection}>
            <h2>{t("detail.playerTitle")}</h2>
            <div className={styles.playerFrame}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedLesson.videoId}`}
                title={selectedLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <aside className={styles.lessonPanel}>
            <h2>{t("detail.lessonsTitle")}</h2>
            <div className={styles.lessonList}>
              {lessons.map((lesson) => (
                <button
                  type="button"
                  key={lesson.id}
                  className={`${styles.lesson} ${
                    lesson.id === selectedLesson?.id ? styles.selectedLesson : ""
                  }`}
                  onClick={() => setSelectedLessonId(lesson.id)}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          </aside>
        </section>
      ) : (
        <p className={styles.status}>{t("detail.noLessons")}</p>
      )}
    </main>
  );
}