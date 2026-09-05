"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import Input from "@/components/Input/Input";
import styles from "./LessonForm.module.scss";
import { useLessonForm } from "./hooks/useLessonForm";

export default function LessonForm({ courseId, onLessonAdded }) {
  const t = useTranslations("adminCourses");
  const {
    form,
    error,
    success,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useLessonForm(courseId, onLessonAdded);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        name="title"
        label={t("lessonForm.titleLabel")}
        type="text"
        placeholder={t("lessonForm.titlePlaceholder")}
        required
        value={form.title}
        onChange={handleChange}
      />

      <Input
        name="order"
        label={t("lessonForm.orderLabel")}
        type="number"
        placeholder={t("lessonForm.orderPlaceholder")}
        required
        min="1"
        value={form.order}
        onChange={handleChange}
      />

      <Input
        name="youtubeUrl"
        label={t("lessonForm.youtubeUrlLabel")}
        type="text"
        placeholder={t("lessonForm.youtubeUrlPlaceholder")}
        required
        value={form.youtubeUrl}
        onChange={handleChange}
      />

      <FormMessage type="error" message={error} />
      <FormMessage
        type="success"
        message={success ? t("lessonForm.success") : null}
      />

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        {t("lessonForm.submitLabel")}
      </Button>
    </form>
  );
}