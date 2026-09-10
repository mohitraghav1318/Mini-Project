"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CourseForm from "./components/CourseForm/CourseForm";
import CourseList from "./components/CourseList/CourseList";
import styles from "./AdminCourses.module.scss";
import { ADMIN_COURSES_NAMESPACE, LOADING_MESSAGE } from "./data";
import { useAdminCourses } from "./hooks/useAdminCourses";

export default function AdminCourses() {
  const { user, isLoading } = useAdminCourses();
  const [courseListVersion, setCourseListVersion] = useState(0);
  const [editingCourse, setEditingCourse] = useState(null);
  const t = useTranslations(ADMIN_COURSES_NAMESPACE);

  if (isLoading) {
    return <p className={styles.loading} role="status">{LOADING_MESSAGE}</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  function handleCourseSaved() {
    setEditingCourse(null);
    setCourseListVersion((version) => version + 1);
  }

  return (
    <main className={styles.page}>
      <h1>{t("title")}</h1>
      <CourseForm
        key={editingCourse?.id || "create"}
        initialCourse={editingCourse}
        onSuccess={handleCourseSaved}
        onCancel={() => setEditingCourse(null)}
      />
      <CourseList
        refreshTrigger={courseListVersion}
        onLessonAdded={() => setCourseListVersion((version) => version + 1)}
        onEditCourse={setEditingCourse}
      />
    </main>
  );
}