"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import { deleteCourse, deleteLesson } from "@/lib/courseApi";
import LessonForm from "../LessonForm/LessonForm";
import styles from "./CourseList.module.scss";
import { useCourseList } from "./hooks/useCourseList";

export default function CourseList({ refreshTrigger, onLessonAdded, onEditCourse }) {
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const t = useTranslations("adminCourses");
  const tOccupations = useTranslations("occupations");
  const { courses, setCourses, isLoading, error } = useCourseList(refreshTrigger);

  if (isLoading) {
    return <p className={styles.status} role="status">{t("list.loading")}</p>;
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  if (courses.length === 0) {
    return <p className={styles.status}>{t("list.empty")}</p>;
  }

  function updateCourseLessons(courseId, updater) {
    setCourses((currentCourses) => currentCourses.map((course) => (
      course.id === courseId
        ? { ...course, lessons: updater(course.lessons || []) }
        : course
    )));
  }

  function handleLessonSaved(courseId, lesson) {
    updateCourseLessons(courseId, (lessons) => {
      const exists = lessons.some((item) => item.id === lesson.id);
      return exists
        ? lessons.map((item) => (item.id === lesson.id ? lesson : item))
        : [...lessons, lesson];
    });
    setEditingLesson(null);
    setExpandedCourseId(null);
    onLessonAdded?.();
  }

  async function handleDeleteCourse(course) {
    if (!window.confirm(t("confirm.deleteCourse"))) return;

    setActionError(null);
    try {
      await deleteCourse(course.id);
      setCourses((currentCourses) => currentCourses.filter((item) => item.id !== course.id));
      setActionSuccess(t("list.courseDeleted"));
    } catch (err) {
      setActionError(err.message || t("list.actionError"));
    }
  }

  async function handleDeleteLesson(course, lesson) {
    if (!window.confirm(t("confirm.deleteLesson"))) return;

    setActionError(null);
    try {
      await deleteLesson(course.id, lesson.id);
      updateCourseLessons(course.id, (lessons) => lessons.filter((item) => item.id !== lesson.id));
      setActionSuccess(t("list.lessonDeleted"));
    } catch (err) {
      setActionError(err.message || t("list.actionError"));
    }
  }

  return (
    <section className={styles.list} aria-label={t("list.heading")}>
      <FormMessage type="error" message={actionError} />
      <FormMessage type="success" message={actionSuccess} />
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
            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={() => onEditCourse?.(course)}>
                {t("list.edit")}
              </Button>
              <Button type="button" variant="secondary" onClick={() => handleDeleteCourse(course)}>
                {t("list.delete")}
              </Button>
            </div>
            {lessonCount > 0 && (
              <div className={styles.lessons}>
                <h3>{t("list.lessonHeading")}</h3>
                {course.lessons.map((lesson) => (
                  <div className={styles.lesson} key={lesson.id}>
                    <div className={styles.lessonDetails}>
                      <strong>{lesson.title}</strong>
                      <span>{lesson.youtubeUrl}</span>
                    </div>
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setEditingLesson({ courseId: course.id, lesson })}
                      >
                        {t("list.edit")}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleDeleteLesson(course, lesson)}
                      >
                        {t("list.delete")}
                      </Button>
                    </div>
                    {editingLesson?.courseId === course.id && editingLesson.lesson.id === lesson.id && (
                      <LessonForm
                        key={lesson.id}
                        courseId={course.id}
                        initialLesson={lesson}
                        onSuccess={(updatedLesson) => handleLessonSaved(course.id, updatedLesson)}
                        onCancel={() => setEditingLesson(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
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
                onSuccess={(lesson) => handleLessonSaved(course.id, lesson)}
              />
            )}
          </article>
        );
      })}
    </section>
  );
}