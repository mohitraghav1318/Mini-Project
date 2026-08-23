"use client";

import Link from "next/link";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Card from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import styles from "./ResetPassword.module.scss";
import { resetPasswordData } from "./data/resetPassword.js";
import { useResetPassword } from "./hooks/useResetPassword";

export default function ResetPassword() {
  const {
    form,
    fieldErrors,
    formError,
    isSubmitting,
    hasToken,
    handleChange,
    handleSubmit,
  } = useResetPassword();

  return (
    <AuthLayout
      heading={resetPasswordData.heading}
      subheading={resetPasswordData.subheading}
    >
      <Card>
        {!hasToken ? (
          <div className={styles.successState}>
            <FormMessage type="error" message={resetPasswordData.invalidTokenMessage} />
            <p className={styles.footerText}>
              <Link href={resetPasswordData.footer.linkHref} className={styles.footerLink}>
                {resetPasswordData.footer.linkLabel}
              </Link>
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <h1 className={styles.title}>Reset password</h1>

            <FormMessage type="error" message={formError} />

            {resetPasswordData.form.fields.map((field) => (
              <Input
                key={field.name}
                {...field}
                value={form[field.name]}
                onChange={handleChange}
                error={fieldErrors[field.name]}
              />
            ))}

            <Button type="submit" isLoading={isSubmitting} fullWidth>
              {resetPasswordData.form.submitLabel}
            </Button>

            <p className={styles.footerText}>
              {resetPasswordData.footer.text}{" "}
              <Link href={resetPasswordData.footer.linkHref} className={styles.footerLink}>
                {resetPasswordData.footer.linkLabel}
              </Link>
            </p>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}