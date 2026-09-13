"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import { Link } from "@/i18n/navigation";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import CourseForm from "@/features/AdminCourses/components/CourseForm/CourseForm";
import LessonForm from "@/features/AdminCourses/components/LessonForm/LessonForm";
import { useAdminCourses } from "@/features/AdminCourses/hooks/useAdminCourses";
import { deleteLesson } from "@/lib/courseApi";
import styles from "./AdminCourseDetail.module.scss";
import { ADMIN_COURSES_NAMESPACE, COURSE_NOT_FOUND_ERROR } from "./data";
import { useAdminCourseDetail } from "./hooks/useAdminCourseDetail";

export default function AdminCourseDetail({ courseId }) {
  const { user, isLoading: isAuthLoading } = useAdminCourses();
  const { course, setCourse, isLoading, error } = useAdminCourseDetail(courseId);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const t = useTranslations(ADMIN_COURSES_NAMESPACE);
  const tOccupations = useTranslations("occupations");

  const lessons = useMemo(
    () => [...(course?.lessons || [])].sort((first, second) => first.order - second.order),
    [course],
  );

  if (isAuthLoading || isLoading) {
    return <p className={styles.status} role="status">{t("detail.loading")}</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  if (error === COURSE_NOT_FOUND_ERROR) {
    return <p className={styles.status}>{t("detail.notFound")}</p>;
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  if (!course) {
    return <p className={styles.status}>{t("detail.notFound")}</p>;
  }

  const category = OCCUPATION_KEYS.includes(course.category)
    ? tOccupations(course.category)
    : course.category;

  function handleCourseSaved(updatedCourse) {
    setCourse((currentCourse) => ({ ...currentCourse, ...updatedCourse }));
    setIsEditingCourse(false);
  }

  function handleLessonSaved(savedLesson) {
    setCourse((currentCourse) => {
      const currentLessons = currentCourse.lessons || [];
      const lessonExists = currentLessons.some((lesson) => lesson.id === savedLesson.id);
      const updatedLessons = lessonExists
        ? currentLessons.map((lesson) => (lesson.id === savedLesson.id ? savedLesson : lesson))
        : [...currentLessons, savedLesson];

      return { ...currentCourse, lessons: updatedLessons };
    });
    setEditingLesson(null);
    setIsAddingLesson(false);
  }

  async function handleDeleteLesson(lesson) {
    if (!window.confirm(t("confirm.deleteLesson"))) return;

    setActionError(null);
    try {
      await deleteLesson(course.id, lesson.id);
      setCourse((currentCourse) => ({
        ...currentCourse,
        lessons: (currentCourse.lessons || []).filter((item) => item.id !== lesson.id),
      }));
      setActionSuccess(t("list.lessonDeleted"));
    } catch (err) {
      setActionError(err.message || t("list.actionError"));
    }
  }

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/admin/courses">
        {t("detail.backToCourses")}
      </Link>
      <header className={styles.header}>
        <h1>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>
        <span className={styles.category}>{category}</span>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={() => setIsEditingCourse(true)}>
            {t("detail.editCourse")}
          </Button>
        </div>
        {isEditingCourse && (
          <CourseForm
            key={course.id}
            initialCourse={course}
            onSuccess={handleCourseSaved}
            onCancel={() => setIsEditingCourse(false)}
          />
        )}
      </header>

      <section className={styles.lessons} aria-label={t("list.lessonHeading")}>
        <h2>{t("list.lessonHeading")}</h2>
        <FormMessage type="error" message={actionError} />
        <FormMessage type="success" message={actionSuccess} />
        {lessons.length === 0 ? (
          <p className={styles.status}>{t("detail.noLessons")}</p>
        ) : (
          lessons.map((lesson) => (
            <article className={styles.lesson} key={lesson.id}>
              <div className={styles.lessonDetails}>
                <h3>{lesson.title}</h3>
                <span>{lesson.youtubeUrl}</span>
              </div>
              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingLesson(lesson)}
                >
                  {t("list.edit")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleDeleteLesson(lesson)}
                >
                  {t("list.delete")}
                </Button>
              </div>
              {editingLesson?.id === lesson.id && (
                <LessonForm
                  key={lesson.id}
                  courseId={course.id}
                  initialLesson={lesson}
                  onSuccess={handleLessonSaved}
                  onCancel={() => setEditingLesson(null)}
                />
              )}
            </article>
          ))
        )}
        <Button type="button" onClick={() => setIsAddingLesson((isAdding) => !isAdding)}>
          {isAddingLesson ? t("list.hideLessonForm") : t("list.addLesson")}
        </Button>
        {isAddingLesson && (
          <LessonForm courseId={course.id} onSuccess={handleLessonSaved} />
        )}
      </section>
    </main>
  );
}
