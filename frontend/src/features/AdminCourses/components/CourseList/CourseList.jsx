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
    return <p className={styles.status} role="status">{t("list.loading")}</p>;
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  if (courses.length === 0) {
    return <p className={styles.status}>{t("list.empty")}</p>;
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
    <section className={styles.list} aria-label={t("list.heading")}>
      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t("list.searchPlaceholder")}
          aria-label={t("list.searchPlaceholder")}
        />
        <SearchableSelect
          name="categoryFilter"
          label={t("form.categoryLabel")}
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
          placeholder={t("list.allCategories")}
        />
      </div>
      <FormMessage type="error" message={actionError} />
      <FormMessage type="success" message={actionSuccess} />
      {filteredCourses.map((course) => {
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
            <p className={styles.lessonCount}>
              {lessonCount} {lessonCount === 1 ? t("list.lesson") : t("list.lessons")}
            </p>
            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/admin/courses/${course.id}`)}
              >
                {t("list.manage")}
              </Button>
              <Button type="button" variant="secondary" onClick={() => handleDeleteCourse(course)}>
                {t("list.delete")}
              </Button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
