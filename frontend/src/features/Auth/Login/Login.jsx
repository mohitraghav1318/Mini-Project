"use client";

import Link from "next/link";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Card from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import styles from "./Login.module.scss";
import { loginData } from "./data/login.data";
import { useLogin } from "./hooks/useLogin";

export default function Login() {
  const { form, fieldErrors, formError, isSubmitting, handleChange, handleSubmit } =
    useLogin();

  return (
    <AuthLayout heading={loginData.heading} subheading={loginData.subheading}>
      <Card>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Log in</h1>

          <FormMessage type="error" message={formError} />

          {loginData.form.fields.map((field) => (
            <Input
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
              error={fieldErrors[field.name]}
            />
          ))}

          <Button type="submit" isLoading={isSubmitting} fullWidth>
            {loginData.form.submitLabel}
          </Button>

          <p className={styles.footerText}>
            {loginData.footer.text}{" "}
            <Link href={loginData.footer.linkHref} className={styles.footerLink}>
              {loginData.footer.linkLabel}
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}
