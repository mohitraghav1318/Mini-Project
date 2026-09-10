"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createCourse, updateCourse } from "@/lib/courseApi";

const initialForm = {
  title: "",
  description: "",
  category: "",
};

export function useCourseForm(initialCourse, onSuccess) {
  const t = useTranslations("adminCourses");
  const [form, setForm] = useState(initialCourse || initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSuccess(false);
  }

  function handleCategoryChange(value) {
    setForm((current) => ({ ...current, category: value }));
    setSuccess(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = initialCourse
        ? await updateCourse(initialCourse.id, form)
        : await createCourse(form);
      setForm(initialCourse || initialForm);
      setSuccess(true);
      onSuccess?.(response?.data);
    } catch (err) {
      setError(err.message || t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    error,
    success,
    isSubmitting,
    handleChange,
    handleCategoryChange,
    handleSubmit,
  };
}