"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordRequest } from "@/lib/authApi";

const initialForm = { newPassword: "", confirmPassword: "" };

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errors = {};
    if (!form.newPassword || form.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (form.confirmPassword !== form.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!token) {
      setFormError("Missing or invalid reset link.");
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordRequest({ token, newPassword: form.newPassword });
      router.push("/login");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    fieldErrors,
    formError,
    isSubmitting,
    hasToken: Boolean(token),
    handleChange,
    handleSubmit,
  };
}