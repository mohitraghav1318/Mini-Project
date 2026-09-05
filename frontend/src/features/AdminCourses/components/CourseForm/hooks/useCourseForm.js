"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createCourse } from "@/lib/courseApi";

const initialForm = {
  title: "",
  description: "",
  category: "",
};

export function useCourseForm() {
  const t = useTranslations("adminCourses");
  const [form, setForm] = useState(initialForm);
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
      await createCourse(form);
      setForm(initialForm);
      setSuccess(true);
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