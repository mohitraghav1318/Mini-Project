"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/userApi";

export function useEditProfileForm(user, onSuccess) {
  const [formValues, setFormValues] = useState({
    shgName: user.shgName ?? "",
    district: user.district ?? "",
    state: user.state ?? "",
    occupation: user.occupation ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(fieldName, value) {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await updateProfile(formValues);
      onSuccess(response.data);
    } catch (err) {
      setError(err.message || "Could not save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return { formValues, handleChange, handleSubmit, isSaving, error };
}