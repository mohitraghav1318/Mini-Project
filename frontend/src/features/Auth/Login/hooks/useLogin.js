"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { loginUser } from "@/lib/authApi";
import { useAuth } from "@/context/AuthContext";

const initialForm = { email: "", password: "" };

export function useLogin() {
  const router = useRouter();
  const { refreshUser } = useAuth();
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
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await loginUser(form);
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, fieldErrors, formError, isSubmitting, handleChange, handleSubmit };
}
