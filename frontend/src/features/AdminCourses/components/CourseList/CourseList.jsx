"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import SearchableSelect from "@/components/SearchableSelect/SearchableSelect";
import { useRouter } from "@/i18n/navigation";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import { deleteCourse } from "@/lib/courseApi";
import styles from "./CourseList.module.scss";
import { useCourseList } from "./hooks/useCourseList";

export default function CourseList({ refreshTrigger }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const router = useRouter();
  const t = useTranslations("adminCourses");
  const tOccupations = useTranslations("occupations");
  const { courses, setCourses, isLoading, error } = useCourseList(refreshTrigger);

  if (isLoading) {
    return (
      <div className={styles.loadingState} role="status">
        <div className={styles.spinner} />
        <p>{t("list.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState} role="alert">
        <p>{error}</p>
      </div>
    );
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

  const categoryOptions = [
    { value: "", label: t("list.allCategories") },
    ...OCCUPATION_KEYS.map((key) => ({
      value: key,
      label: tOccupations(key),
    })),
  ];

  const filteredCourses = courses.filter((course) => (
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
    && (!selectedCategory || course.category === selectedCategory)
  ));

  return (
    <section className={styles.listSection} aria-label={t("list.heading")}>
      <div className={styles.headerToolbar}>
        <div className={styles.sectionTitle}>
          <h2>{t("list.heading")}</h2>
          <span className={styles.badge}>{filteredCourses.length}</span>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19l-4-4m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className={styles.searchInput}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("list.searchPlaceholder")}
              aria-label={t("list.searchPlaceholder")}
            />
          </div>
          <div className={styles.categorySelect}>
            <SearchableSelect
              name="categoryFilter"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder={t("list.allCategories")}
            />
          </div>
        </div>
      </div>

      <FormMessage type="error" message={actionError} />
      <FormMessage type="success" message={actionSuccess} />

      {filteredCourses.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p>{t("list.empty")}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredCourses.map((course) => {
            const lessonCount = course.lessons?.length ?? 0;
            const category = OCCUPATION_KEYS.includes(course.category)
              ? tOccupations(course.category)
              : course.category;

            return (
              <article className={styles.card} key={course.id}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <span className={styles.categoryBadge}>{category}</span>
                </div>
                
                {course.description && (
                  <p className={styles.courseDescription}>{course.description}</p>
                )}

                <div className={styles.metaRow}>
                  <span className={styles.lessonMeta}>
                    <svg className={styles.metaIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    {lessonCount} {lessonCount === 1 ? t("list.lesson") : t("list.lessons")}
                  </span>
                </div>

                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => router.push(`/admin/courses/${course.id}`)}
                  >
                    {t("list.manage")}
                  </Button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteCourse(course)}
                  >
                    {t("list.delete")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

