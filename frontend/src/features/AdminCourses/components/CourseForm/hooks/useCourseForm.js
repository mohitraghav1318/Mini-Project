"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createCourse, updateCourse } from "@/lib/courseApi";
import { mergeOutlineIntoDescription } from "../../AiAssistant/outlineToCourse";

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
  // Synchronous mirror of the form so Apply can merge against the latest
  // description even if a render has not flushed yet.
  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

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
    applyGenerated,
    applyOutlineEdit,
  };

  function applyGenerated(generated) {
    if (!generated) return;
    setForm((current) => ({
      ...current,
      ...(generated.title !== undefined && { title: generated.title }),
      ...(generated.description !== undefined && { description: generated.description }),
      ...(generated.category ? { category: generated.category } : {}),
    }));
    setError(null);
    setSuccess(false);
  }

  // Edit-mode apply: merges the outline into the live description,
  // optionally takes the suggested title, and never touches the category
  // or any lesson. Returns { replaced } for the managed-section notice.
  function applyOutlineEdit({ outline, draft, updateTitle }) {
    if (!outline) return { replaced: false };
    const current = formRef.current || {};
    const merged = mergeOutlineIntoDescription(current.description || "", outline, draft);
    setForm({
      ...current,
      ...(updateTitle && draft?.title ? { title: draft.title } : {}),
      description: merged.description,
    });
    setError(null);
    setSuccess(false);
    return { replaced: merged.replaced };
  }
}