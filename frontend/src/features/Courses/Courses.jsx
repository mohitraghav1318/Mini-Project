"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  GraduationCap,
  XCircle,
  Clock,
  Award,
} from "lucide-react";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import styles from "./Courses.module.scss";
import { useCourses } from "./hooks/useCourses";

export default function Courses() {
  const t = useTranslations("courses");
  const tOccupations = useTranslations("occupations");
  const router = useRouter();
  const { courses, isLoading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredCourses = normalizedSearchQuery
    ? courses.filter((course) => {
        const title = course.title?.toLowerCase() || "";
        const description = course.description?.toLowerCase() || "";
        return title.includes(normalizedSearchQuery) || description.includes(normalizedSearchQuery);
      })
    : courses;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Hero Header Card */}
        <section className={styles.heroSection}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>
              <Sparkles size={14} aria-hidden="true" /> {t("eyebrow")}
            </span>
            <h1 className={styles.heroTitle}>{t("title")}</h1>
            <p className={styles.heroSubtitle}>{t("subtitle")}</p>

            {/* Search Bar */}
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} aria-hidden="true" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchLabel")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        {isLoading ? (
          <div className={styles.skeletonGrid} aria-label={t("loading")} role="status">
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        ) : error ? (
          <div className={styles.errorState} role="alert">
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.emptyState}>
            <GraduationCap size={40} className={styles.emptyIcon} />
            <p className={styles.emptyText}>{t("empty")}</p>
          </div>
        ) : (
          <>
            {filteredCourses.length === 0 ? (
              <div className={styles.noResultsState}>
                <p className={styles.noResultsText}>{t("noResults")}</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <section className={styles.grid} aria-label={t("title")}>
                {filteredCourses.map((course) => {
                  const lessonCount = course.lessons?.length ?? 0;
                  const category = OCCUPATION_KEYS.includes(course.category)
                    ? tOccupations(course.category)
                    : course.category || "General";

                  return (
                    <article
                      className={styles.card}
                      key={course.id}
                      onClick={() => router.push(`/courses/${course.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/courses/${course.id}`);
                        }
                      }}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardIconWrapper}>
                          <BookOpen size={22} />
                        </div>
                        <span className={styles.categoryBadge}>{category}</span>
                      </div>

                      <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>{course.title}</h2>
                        {course.description && (
                          <p className={styles.cardDesc}>{course.description}</p>
                        )}
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.lessonMeta}>
                          <Clock size={15} />
                          <span>
                            {lessonCount} {lessonCount === 1 ? t("lesson") : t("lessons")}
                          </span>
                        </div>
                        <span className={styles.startBtn}>
                          {t("startCourse")} <ArrowRight size={15} className={styles.btnArrow} />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}