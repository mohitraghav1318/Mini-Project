"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { registerUser } from "@/lib/authApi";
import { useAuth } from "@/context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  shgName: "",
  district: "",
  state: "",
  occupation: "",
};

export function useRegister() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const tErrors = useTranslations("register.errors");
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleValueChange(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = tErrors("nameRequired");
    } else if (form.name.trim().length < 2) {
      errors.name = tErrors("nameMinLength");
    }

    if (!form.email.trim()) {
      errors.email = tErrors("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = tErrors("emailInvalid");
    }

    if (!form.password) {
      errors.password = tErrors("passwordRequired");
    } else if (form.password.length < 8) {
      errors.password = tErrors("passwordMinLength");
    }

    if (!form.shgName.trim()) {
      errors.shgName = tErrors("shgNameRequired");
    } else if (form.shgName.trim().length < 2) {
      errors.shgName = tErrors("shgNameMinLength");
    }

    if (!form.district.trim()) {
      errors.district = tErrors("districtRequired");
    }

    if (!form.state.trim()) {
      errors.state = tErrors("stateRequired");
    }

    if (!form.occupation.trim()) {
      errors.occupation = tErrors("occupationRequired");
    }

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
      await registerUser(form);
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setFormError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    fieldErrors,
    formError,
    isSubmitting,
    handleChange,
    handleValueChange,
    handleSubmit,
  };
}
