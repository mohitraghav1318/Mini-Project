import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import Card from "@/components/Card/Card";
import styles from "./EnrolledCourses.module.scss";

export default function EnrolledCourses({ enrollments, isLoading, hasError, t }) {
  return (
    <section className={styles.section} aria-labelledby="enrolled-courses-title">
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.eyebrow}>
            <Sparkles size={13} aria-hidden="true" /> {t("courses.eyebrow")}
          </span>
          <h2 className={styles.title} id="enrolled-courses-title">
            {t("courses.title")}
          </h2>
        </div>
        <Link className={styles.exploreLink} href="/courses">
          {t("courses.explore")} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <div className={styles.loadingSkeletonGrid}>
          <div className={styles.loadingSkeletonCard} />
          <div className={styles.loadingSkeletonCard} />
        </div>
      ) : hasError ? (
        <p className={styles.error} role="alert">{t("courses.error")}</p>
      ) : enrollments && enrollments.length > 0 ? (
        <>
          <p className={styles.count}>{t("courses.enrolledCount", { count: enrollments.length })}</p>
          <div className={styles.grid}>
            {enrollments.map((enrollment) => (
              <Link
                className={styles.courseLink}
                key={enrollment.courseId}
                href={`/courses/${enrollment.courseId}`}
              >
                <div className={styles.courseCard}>
                  <div className={styles.iconWrapper}>
                    <BookOpen size={22} aria-hidden="true" />
                  </div>
                  <div className={styles.courseContent}>
                    <div className={styles.courseCategoryTag}>Skill Training</div>
                    <h3 className={styles.courseTitle}>{enrollment.title}</h3>
                    <span className={styles.courseAction}>
                      {t("courses.openCourse")} <ArrowRight className={styles.courseArrow} size={15} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIconWrapper}>
            <GraduationCap size={28} aria-hidden="true" />
          </div>
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>{t("courses.title")}</h3>
            <p className={styles.emptyStatus}>{t("courses.empty")}</p>
          </div>
          <Link className={styles.emptyExplore} href="/courses">
            {t("courses.explore")} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
