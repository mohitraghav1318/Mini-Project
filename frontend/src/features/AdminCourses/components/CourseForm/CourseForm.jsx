"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import Input from "@/components/Input/Input";
import SearchableSelect from "@/components/SearchableSelect/SearchableSelect";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import styles from "./CourseForm.module.scss";
import { useCourseForm } from "./hooks/useCourseForm";

export default function CourseForm({ initialCourse, onSuccess, onCancel }) {
  const t = useTranslations("adminCourses");
  const tOccupations = useTranslations("occupations");
  const {
    form,
    error,
    success,
    isSubmitting,
    handleChange,
    handleCategoryChange,
    handleSubmit,
  } = useCourseForm(initialCourse, onSuccess);

  const occupationOptions = OCCUPATION_KEYS.map((key) => ({
    value: key,
    label: tOccupations(key),
  }));

  return (
    <section className={styles.cardPanel}>
      <div className={styles.cardHeader}>
        <h2>{t(initialCourse ? "form.editHeading" : "form.heading")}</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.fieldCol}>
            <Input
              name="title"
              label={t("form.titleLabel")}
              type="text"
              placeholder={t("form.titlePlaceholder")}
              required
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldCol}>
            <SearchableSelect
              name="category"
              label={t("form.categoryLabel")}
              placeholder={t("form.categoryPlaceholder")}
              required
              value={form.category}
              onChange={handleCategoryChange}
              options={occupationOptions}
            />
          </div>

          <div className={`${styles.fieldCol} ${styles.fullWidth}`}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="description">
                {t("form.descriptionLabel")}
                <span className={styles.requiredMark} aria-hidden="true"> *</span>
              </label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                placeholder={t("form.descriptionPlaceholder")}
                required
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <FormMessage type="error" message={error} />
        <FormMessage
          type="success"
          message={success ? t(initialCourse ? "form.updateSuccess" : "form.success") : null}
        />

        <div className={styles.actions}>
          {initialCourse && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              {t("form.cancelLabel")}
            </Button>
          )}
          <Button type="submit" isLoading={isSubmitting}>
            {t(initialCourse ? "form.updateSubmitLabel" : "form.submitLabel")}
          </Button>
        </div>
      </form>
    </section>
  );
}