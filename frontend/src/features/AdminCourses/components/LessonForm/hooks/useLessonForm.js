"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createLesson } from "@/lib/courseApi";

const initialForm = {
  title: "",
  order: "",
  youtubeUrl: "",
};

export function useLessonForm(courseId, onLessonAdded) {
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

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createLesson(courseId, { ...form, order: Number(form.order) });
      setForm(initialForm);
      setSuccess(true);
      onLessonAdded?.();
    } catch (err) {
      setError(err.message || t("lessonForm.error"));
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
    handleSubmit,
  };
}