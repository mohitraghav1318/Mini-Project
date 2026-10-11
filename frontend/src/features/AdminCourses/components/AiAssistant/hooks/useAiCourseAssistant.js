"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { generateCourseOutline } from "@/lib/courseAiApi";
import { buildCourseDescription } from "../outlineToCourse";

const initialRequest = {
  topic: "",
  occupation: "",
  level: "beginner",
  language: "both",
  lessonCount: 5,
};

const initialDraft = {
  title: "",
  descriptionEn: "",
  descriptionHi: "",
};

function clampLessonCount(value) {
  const count = Number(value);
  if (!Number.isInteger(count)) return 5;
  return Math.min(8, Math.max(3, count));
}

export function useAiCourseAssistant(onApply, options = {}) {
  const mode = options.mode === "edit" ? "edit" : "create";
  const initialCourse = options.initialCourse || null;
  const isEdit = mode === "edit";
  const t = useTranslations("adminCourses");
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState(() =>
    isEdit && initialCourse
      ? {
          topic: initialCourse.title || "",
          occupation: initialCourse.category || "",
          level: "beginner",
          language: "both",
          lessonCount: clampLessonCount(initialCourse.lessons?.length || 3),
        }
      : initialRequest
  );
  const [context, setContext] = useState(
    isEdit ? initialCourse?.description || "" : ""
  );
  const [updateTitle, setUpdateTitle] = useState(false);
  const [replaced, setReplaced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [outline, setOutline] = useState(null);
  const [draft, setDraft] = useState(initialDraft);
  const [applied, setApplied] = useState(false);

  function toggle() {
    setIsOpen((current) => !current);
  }

  function handleRequestChange(event) {
    const { name, value } = event.target;
    setRequest((current) => ({ ...current, [name]: value }));
    setApplied(false);
  }

  function handleSelectChange(name, value) {
    setRequest((current) => ({ ...current, [name]: value }));
    setApplied(false);
  }

  function handleDraftChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setApplied(false);
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setIsGenerating(true);
    setError(null);
    setApplied(false);
    setReplaced(false);

    try {
      const trimmedContext = context.trim();
      const response = await generateCourseOutline({
        ...request,
        lessonCount: clampLessonCount(request.lessonCount),
        ...(trimmedContext && { context: trimmedContext.slice(0, 2000) }),
      });
      const data = response?.data;
      if (!data || !data.title) {
        throw new Error(t("ai.empty"));
      }
      setOutline(data);
      setDraft({
        title: data.title || "",
        descriptionEn: data.descriptionEn || "",
        descriptionHi: data.descriptionHi || "",
      });
    } catch (err) {
      setOutline(null);
      setError(err.message || t("ai.error"));
    } finally {
      setIsGenerating(false);
    }
  }

  function handleApply() {
    if (!outline && !draft.title && !draft.descriptionEn && !draft.descriptionHi) return;
    if (isEdit) {
      // Edit mode never touches the category and only merges into the
      // description; the title changes only when explicitly chosen.
      // Merging reads the live form state inside onApply, so form edits
      // made while generation was in flight are preserved.
      const result = onApply?.({ outline, draft, updateTitle }) || {};
      setReplaced(Boolean(result.replaced));
      setApplied(true);
      return;
    }
    onApply?.({
      title: draft.title,
      description: buildCourseDescription(outline, draft),
      category: request.occupation || undefined,
    });
    setApplied(true);
  }

  function handleContextChange(event) {
    setContext(event.target.value);
    setApplied(false);
  }

  return {
    isOpen,
    isEdit,
    request,
    context,
    updateTitle,
    replaced,
    isGenerating,
    error,
    outline,
    draft,
    applied,
    toggle,
    handleRequestChange,
    handleSelectChange,
    handleDraftChange,
    handleContextChange,
    handleGenerate,
    handleApply,
    setUpdateTitle,
  };
}
