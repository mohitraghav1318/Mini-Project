"use client";

import styles from "./Button.module.scss";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""}`}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : children}
    </button>
  );
}
