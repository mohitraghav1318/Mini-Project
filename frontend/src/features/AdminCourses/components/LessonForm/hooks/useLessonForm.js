"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createLesson, updateLesson } from "@/lib/courseApi";

const initialForm = {
  title: "",
  order: "",
  youtubeUrl: "",
};

export function useLessonForm(courseId, initialLesson, onSuccess) {
  const t = useTranslations("adminCourses");
  const [form, setForm] = useState(initialLesson || initialForm);
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
      const payload = { ...form, order: Number(form.order) };
      const response = initialLesson
        ? await updateLesson(courseId, initialLesson.id, payload)
        : await createLesson(courseId, payload);
      setForm(initialLesson || initialForm);
      setSuccess(true);
      onSuccess?.(response?.data);
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