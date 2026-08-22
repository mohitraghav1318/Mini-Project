"use client";

import { EDIT_PROFILE_FIELDS } from "./data/editProfileFields";
import { useEditProfileForm } from "./hooks/useEditProfileForm";
import InterestSelect from "./components/InterestSelect/InterestSelect";
import styles from "./EditProfileForm.module.scss";

export default function EditProfileForm({ user, onSuccess, onCancel }) {
  const { formValues, handleChange, handleSubmit, isSaving, error } = useEditProfileForm(user, onSuccess);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {EDIT_PROFILE_FIELDS.map((field) => (
        <div key={field.name} className={styles.fieldGroup}>
          <label className={styles.label} htmlFor={field.name}>
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              className={styles.textarea}
              value={formValues[field.name]}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ) : (
            <input
              id={field.name}
              type="text"
              className={styles.input}
              value={formValues[field.name]}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Interests</label>
        <InterestSelect
          selectedIds={formValues.interestIds}
          onChange={(newIds) => handleChange("interestIds", newIds)}
        />
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}