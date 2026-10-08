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
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.status} role="status">{t("detail.loading")}</p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  if (error === COURSE_NOT_FOUND_ERROR) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.status}>{t("detail.notFound")}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.error} role="alert">{error}</p>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.status}>{t("detail.notFound")}</p>
        </div>
      </main>
    );
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
      <div className={styles.container}>
        <div className={styles.topNav}>
          <Link className={styles.backLink} href="/admin/courses">
            <svg className={styles.backIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-5-5 5-5" />
            </svg>
            {t("detail.backToCourses")}
          </Link>
        </div>

        <header className={styles.heroCard}>
          <div className={styles.heroContent}>
            <div className={styles.heroMetaTop}>
              <span className={styles.categoryBadge}>{category}</span>
              <span className={styles.lessonCountBadge}>
                <svg className={styles.metaIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                {lessons.length} {lessons.length === 1 ? t("list.lesson") : t("list.lessons")}
              </span>
            </div>

            <div className={styles.heroTitleRow}>
              <h1 className={styles.title}>{course.title}</h1>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditingCourse((prev) => !prev)}
              >
                <svg className={styles.btnIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {isEditingCourse ? t("form.cancelLabel") : t("detail.editCourse")}
              </Button>
            </div>

            {course.description && (
              <p className={styles.description}>{course.description}</p>
            )}
          </div>

          {isEditingCourse && (
            <div className={styles.courseFormDrawer}>
              <CourseForm
                key={course.id}
                initialCourse={course}
                onSuccess={handleCourseSaved}
                onCancel={() => setIsEditingCourse(false)}
              />
            </div>
          )}
        </header>

        <section className={styles.lessonsSection} aria-label={t("list.lessonHeading")}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2>{t("list.lessonHeading")}</h2>
              <span className={styles.badge}>{lessons.length}</span>
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setIsAddingLesson((isAdding) => !isAdding);
                setEditingLesson(null);
              }}
            >
              <svg className={styles.btnIcon} viewBox="0 0 20 20" fill="currentColor">
                {isAddingLesson ? (
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                )}
              </svg>
              {isAddingLesson ? t("list.hideLessonForm") : t("list.addLesson")}
            </Button>
          </div>

          <FormMessage type="error" message={actionError} />
          <FormMessage type="success" message={actionSuccess} />

          {isAddingLesson && (
            <div className={styles.formContainer}>
              <h3 className={styles.formContainerTitle}>{t("list.addLesson")}</h3>
              <LessonForm
                courseId={course.id}
                onSuccess={handleLessonSaved}
                onCancel={() => setIsAddingLesson(false)}
              />
            </div>
          )}

          {lessons.length === 0 ? (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3>{t("detail.noLessons")}</h3>
              {!isAddingLesson && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsAddingLesson(true)}
                >
                  + {t("list.addLesson")}
                </Button>
              )}
            </div>
          ) : (
            <div className={styles.lessonList}>
              {lessons.map((lesson, index) => {
                const formattedIndex = String(lesson.order ?? index + 1).padStart(2, "0");
                const isEditingThisLesson = editingLesson?.id === lesson.id;

                return (
                  <article className={styles.lessonCard} key={lesson.id}>
                    <div className={styles.lessonCardMain}>
                      <div className={styles.orderBadge}>{formattedIndex}</div>
                      <div className={styles.lessonInfo}>
                        <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                        {lesson.youtubeUrl && (
                          <a
                            href={lesson.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.videoLink}
                          >
                            <svg className={styles.videoIcon} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <span>{lesson.youtubeUrl}</span>
                          </a>
                        )}
                      </div>
                      <div className={styles.cardActions}>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setIsAddingLesson(false);
                            setEditingLesson(isEditingThisLesson ? null : lesson);
                          }}
                        >
                          {isEditingThisLesson ? t("form.cancelLabel") : t("list.edit")}
                        </Button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteLesson(lesson)}
                        >
                          {t("list.delete")}
                        </button>
                      </div>
                    </div>

                    {isEditingThisLesson && (
                      <div className={styles.inlineEditForm}>
                        <h4 className={styles.editFormTitle}>{t("lessonForm.updateSubmitLabel")}</h4>
                        <LessonForm
                          key={lesson.id}
                          courseId={course.id}
                          initialLesson={lesson}
                          onSuccess={handleLessonSaved}
                          onCancel={() => setEditingLesson(null)}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

