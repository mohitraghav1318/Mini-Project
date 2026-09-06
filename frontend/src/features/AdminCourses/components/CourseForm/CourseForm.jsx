"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import Input from "@/components/Input/Input";
import SearchableSelect from "@/components/SearchableSelect/SearchableSelect";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import styles from "./CourseForm.module.scss";
import { useCourseForm } from "./hooks/useCourseForm";

export default function CourseForm({ onSuccess }) {
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
  } = useCourseForm(onSuccess);

  const occupationOptions = OCCUPATION_KEYS.map((key) => ({
    value: key,
    label: tOccupations(key),
  }));

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        name="title"
        label={t("form.titleLabel")}
        type="text"
        placeholder={t("form.titlePlaceholder")}
        required
        value={form.title}
        onChange={handleChange}
      />

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="description">
          {t("form.descriptionLabel")}
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

      <SearchableSelect
        name="category"
        label={t("form.categoryLabel")}
        placeholder={t("form.categoryPlaceholder")}
        required
        value={form.category}
        onChange={handleCategoryChange}
        options={occupationOptions}
      />

      <FormMessage type="error" message={error} />
      <FormMessage type="success" message={success ? t("form.success") : null} />

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        {t("form.submitLabel")}
      </Button>
    </form>
  );
}