"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/Button/Button";
import { useAuth } from "@/context/AuthContext";
import styles from "./CourseDetail.module.scss";
import { useCourseDetail } from "./hooks/useCourseDetail";
import { useCourseEnrollment } from "./hooks/useCourseEnrollment";

export default function CourseDetail({ courseId }) {
  const t = useTranslations("courses");
  const tCommunity = useTranslations("community");
  const router = useRouter();
  const { course, isLoading, error } = useCourseDetail(courseId);
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    isEnrolled,
    isLoading: isEnrollmentLoading,
    isMutating,
    error: enrollmentError,
    toggleEnrollment,
  } = useCourseEnrollment(courseId, !isAuthLoading && Boolean(user));
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
        <div className={styles.titleRow}>
          <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </div>
          <div className={styles.enrollmentAction}>
            {user?.role === "ADMIN" ? (
              <>
                <Button disabled>{t("detail.adminCannotEnroll")}</Button>
                <span className={styles.enrollmentHint}>{t("detail.adminEnrollHint")}</span>
              </>
            ) : (
              <Button
                variant={isEnrolled ? "secondary" : "primary"}
                disabled={isEnrollmentLoading}
                isLoading={isEnrollmentLoading || isMutating}
                onClick={toggleEnrollment}
              >
                {isEnrolled ? t("detail.unenroll") : t("detail.enroll")}
              </Button>
            )}
            {(user?.role === "ADMIN" || isEnrolled) && (
              <Button
                variant="secondary"
                onClick={() => router.push(`/courses/${courseId}/community`)}
              >
                {tCommunity("openCommunity")}
              </Button>
            )}
            {enrollmentError && (
              <span className={styles.enrollmentError} role="alert">
                {t(`detail.enrollmentErrors.${enrollmentError}`)}
              </span>
            )}
          </div>
        </div>
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