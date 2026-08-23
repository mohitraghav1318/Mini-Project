"use client";

import Link from "next/link";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Card from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import styles from "./ForgotPassword.module.scss";
import { forgotPasswordData } from "./data/forgotPassword.js";
import { useForgotPassword } from "./hooks/useForgotPassword";

export default function ForgotPassword() {
  const {
    form,
    fieldErrors,
    formError,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
  } = useForgotPassword();

  return (
    <AuthLayout
      heading={forgotPasswordData.heading}
      subheading={forgotPasswordData.subheading}
    >
      <Card>
        {isSubmitted ? (
          <div className={styles.successState}>
            <FormMessage type="success" message={forgotPasswordData.successMessage} />
            <p className={styles.footerText}>
              <Link href={forgotPasswordData.footer.linkHref} className={styles.footerLink}>
                {forgotPasswordData.footer.linkLabel}
              </Link>
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <h1 className={styles.title}>Reset password</h1>

            <FormMessage type="error" message={formError} />

            {forgotPasswordData.form.fields.map((field) => (
              <Input
                key={field.name}
                {...field}
                value={form[field.name]}
                onChange={handleChange}
                error={fieldErrors[field.name]}
              />
            ))}

            <Button type="submit" isLoading={isSubmitting} fullWidth>
              {forgotPasswordData.form.submitLabel}
            </Button>

            <p className={styles.footerText}>
              {forgotPasswordData.footer.text}{" "}
              <Link href={forgotPasswordData.footer.linkHref} className={styles.footerLink}>
                {forgotPasswordData.footer.linkLabel}
              </Link>
            </p>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}