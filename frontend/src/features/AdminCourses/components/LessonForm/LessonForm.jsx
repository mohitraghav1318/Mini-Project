"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import Input from "@/components/Input/Input";
import styles from "./LessonForm.module.scss";
import { useLessonForm } from "./hooks/useLessonForm";

export default function LessonForm({ courseId, initialLesson, onSuccess, onCancel }) {
  const t = useTranslations("adminCourses");
  const {
    form,
    error,
    success,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useLessonForm(courseId, initialLesson, onSuccess);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <div className={styles.titleField}>
          <Input
            name="title"
            label={t("lessonForm.titleLabel")}
            type="text"
            placeholder={t("lessonForm.titlePlaceholder")}
            required
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className={styles.orderField}>
          <Input
            name="order"
            label={t("lessonForm.orderLabel")}
            type="number"
            placeholder={t("lessonForm.orderPlaceholder")}
            required
            value={form.order}
            onChange={handleChange}
          />
        </div>
      </div>

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
        message={success ? t(initialLesson ? "lessonForm.updateSuccess" : "lessonForm.success") : null}
      />

      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t("lessonForm.cancelLabel")}
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {t(initialLesson ? "lessonForm.updateSubmitLabel" : "lessonForm.submitLabel")}
        </Button>
      </div>
    </form>
  );
}