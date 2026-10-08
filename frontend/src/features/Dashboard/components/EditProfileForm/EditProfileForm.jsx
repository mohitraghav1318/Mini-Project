"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, UserCheck } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect/SearchableSelect";
import { OCCUPATION_KEYS, STATE_KEYS } from "@/features/Auth/Register/data/register.data";
import { EDIT_PROFILE_FIELDS } from "./data/editProfileFields";
import { useEditProfileForm } from "./hooks/useEditProfileForm";
import styles from "./EditProfileForm.module.scss";

export default function EditProfileForm({ user, onSuccess, onCancel }) {
  const t = useTranslations("dashboard");
  const tStates = useTranslations("states");
  const tOccupations = useTranslations("occupations");
  const { formValues, handleChange, handleSubmit, isSaving, error } = useEditProfileForm(user, onSuccess);

  const stateOptions = STATE_KEYS.map((key) => ({
    value: key,
    label: tStates(key),
  }));
  const occupationOptions = OCCUPATION_KEYS.map((key) => ({
    value: key,
    label: tOccupations(key),
  }));

  // Handle ESC key press to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && !isSaving) {
        onCancel();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, isSaving]);

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onCancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.headerIcon}>
              <UserCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 id="modal-title" className={styles.modalTitle}>
                {t("editProfile.modalTitle")}
              </h2>
              <p className={styles.modalSubtitle}>{t("editProfile.modalSubtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onCancel}
            disabled={isSaving}
            aria-label={t("editProfile.cancel")}
          >
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldsGrid}>
            {EDIT_PROFILE_FIELDS.map((field) =>
              field.type === "state" || field.type === "occupation" ? (
                <SearchableSelect
                  key={field.name}
                  name={field.name}
                  label={t(`profile.${field.name}`)}
                  placeholder={t(`editProfile.${field.name}Placeholder`)}
                  required
                  value={formValues[field.name]}
                  onChange={(value) => handleChange(field.name, value)}
                  options={field.type === "state" ? stateOptions : occupationOptions}
                />
              ) : (
                <div key={field.name} className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor={field.name}>
                    {t(`profile.${field.name}`)}
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    className={styles.input}
                    value={formValues[field.name]}
                    placeholder={t(`editProfile.${field.name}Placeholder`)}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                </div>
              )
            )}
          </div>

          {error && <p className={styles.errorText} role="alert">{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={isSaving}>
              {t("editProfile.cancel")}
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? t("editProfile.saving") : t("editProfile.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}