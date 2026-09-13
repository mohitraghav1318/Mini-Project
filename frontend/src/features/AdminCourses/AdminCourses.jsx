"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import CourseForm from "./components/CourseForm/CourseForm";
import CourseList from "./components/CourseList/CourseList";
import styles from "./AdminCourses.module.scss";
import { ADMIN_COURSES_NAMESPACE, LOADING_MESSAGE } from "./data";
import { useAdminCourses } from "./hooks/useAdminCourses";

export default function AdminCourses() {
  const { user, isLoading } = useAdminCourses();
  const router = useRouter();
  const t = useTranslations(ADMIN_COURSES_NAMESPACE);

  if (isLoading) {
    return <p className={styles.loading} role="status">{LOADING_MESSAGE}</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  function handleCourseCreated(course) {
    router.push(`/admin/courses/${course.id}`);
  }

  return (
    <main className={styles.page}>
      <h1>{t("title")}</h1>
      <CourseForm
        onSuccess={handleCourseCreated}
      />
      <CourseList />
    </main>
  );
}
