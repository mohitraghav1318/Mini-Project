"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  UserPlus,
  UserMinus,
  MessageSquare,
  PlayCircle,
  ShieldAlert,
  Clock,
  ListVideo,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import styles from "./CourseDetail.module.scss";
import { useCourseDetail } from "./hooks/useCourseDetail";
import { useCourseEnrollment } from "./hooks/useCourseEnrollment";

export default function CourseDetail({ courseId }) {
  const t = useTranslations("courses");
  const tCommunity = useTranslations("community");
  const tOccupations = useTranslations("occupations");
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
    [course]
  );

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonGrid} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorState} role="alert">
            <p>{error}</p>
            <Link href="/courses" className={styles.backBtn}>
              <ArrowLeft size={16} /> {t("detail.backToCourses")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <p>{t("detail.notFound")}</p>
            <Link href="/courses" className={styles.backBtn}>
              <ArrowLeft size={16} /> {t("detail.backToCourses")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];
  const category = OCCUPATION_KEYS.includes(course.category)
    ? tOccupations(course.category)
    : course.category || "General";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Back Link Button */}
        <div className={styles.navBar}>
          <Link href="/courses" className={styles.backLink}>
            <ArrowLeft size={18} aria-hidden="true" />
            <span>{t("detail.backToCourses")}</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <section className={styles.heroCard}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={styles.heroHeader}>
            <div className={styles.heroTitleBlock}>
              <div className={styles.eyebrowRow}>
                <span className={styles.categoryBadge}>
                  <BookOpen size={13} aria-hidden="true" /> {category}
                </span>
                {isEnrolled && (
                  <span className={styles.enrolledBadge}>
                    <CheckCircle2 size={13} aria-hidden="true" /> {t("detail.enrolledBadge")}
                  </span>
                )}
              </div>
              <h1 className={styles.courseTitle}>{course.title}</h1>
              {course.description && (
                <p className={styles.courseDescription}>{course.description}</p>
              )}

              <div className={styles.metaRow}>
                <div className={styles.metaBadge}>
                  <Clock size={15} />
                  <span>
                    {lessons.length} {lessons.length === 1 ? t("lesson") : t("lessons")}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons ("btns") */}
            <div className={styles.actionButtonGroup}>
              {user?.role === "ADMIN" ? (
                <div className={styles.adminNotice}>
                  <ShieldAlert size={18} />
                  <span>{t("detail.adminEnrollHint")}</span>
                </div>
              ) : (
                <button
                  type="button"
                  className={`${styles.actionBtn} ${
                    isEnrolled ? styles.actionBtnEnrolled : styles.actionBtnEnroll
                  }`}
                  disabled={isEnrollmentLoading || isMutating}
                  onClick={toggleEnrollment}
                >
                  {isMutating ? (
                    <span>Processing...</span>
                  ) : isEnrolled ? (
                    <>
                      <UserMinus size={18} />
                      <span>{t("detail.unenroll")}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>{t("detail.enroll")}</span>
                    </>
                  )}
                </button>
              )}

              {(user?.role === "ADMIN" || isEnrolled) && (
                <button
                  type="button"
                  className={styles.communityBtn}
                  onClick={() => router.push(`/courses/${courseId}/community`)}
                >
                  <MessageSquare size={18} />
                  <span>{tCommunity("openCommunity")}</span>
                </button>
              )}

              {enrollmentError && (
                <span className={styles.enrollmentError} role="alert">
                  {t(`detail.enrollmentErrors.${enrollmentError}`)}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Learning Area: Cinema Player & Lesson Playlist Cards */}
        {selectedLesson ? (
          <section className={styles.learningGrid}>
            {/* Player Container */}
            <div className={styles.playerCard}>
              <div className={styles.playerHeader}>
                <div className={styles.playerHeaderTitle}>
                  <PlayCircle size={18} className={styles.playerHeaderIcon} />
                  <span>{t("detail.nowWatching")}</span>
                </div>
                <span className={styles.currentLessonName}>{selectedLesson.title}</span>
              </div>
              <div className={styles.playerFrame}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedLesson.videoId}`}
                  title={selectedLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Lesson Cards Playlist */}
            <aside className={styles.playlistCard}>
              <div className={styles.playlistHeader}>
                <ListVideo size={20} className={styles.playlistIcon} />
                <h2 className={styles.playlistTitle}>{t("detail.playlistTitle")}</h2>
                <span className={styles.playlistCount}>{lessons.length}</span>
              </div>

              <div className={styles.lessonList}>
                {lessons.map((lesson, index) => {
                  const isSelected = lesson.id === selectedLesson?.id;
                  return (
                    <button
                      type="button"
                      key={lesson.id}
                      className={`${styles.lessonCard} ${
                        isSelected ? styles.lessonCardSelected : ""
                      }`}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <div className={styles.lessonIndexBadge}>
                        {isSelected ? <PlayCircle size={16} /> : index + 1}
                      </div>
                      <div className={styles.lessonInfo}>
                        <span className={styles.lessonTitle}>{lesson.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          </section>
        ) : (
          <div className={styles.noLessonsCard}>
            <p>{t("detail.noLessons")}</p>
          </div>
        )}
      </div>
    </main>
  );
}