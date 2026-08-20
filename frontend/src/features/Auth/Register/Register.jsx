"use client";

import Link from "next/link";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Card from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import styles from "./Register.module.scss";
import { registerData } from "./data/register.data";
import { useRegister } from "./hooks/useRegister";

export default function Register() {
  const { form, fieldErrors, formError, isSubmitting, handleChange, handleSubmit } =
    useRegister();

  return (
    <AuthLayout heading={registerData.heading} subheading={registerData.subheading}>
      <Card>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Create your account</h1>

          <FormMessage type="error" message={formError} />

          {registerData.form.fields.map((field) => (
            <Input
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
              error={fieldErrors[field.name]}
            />
          ))}

          <Button type="submit" isLoading={isSubmitting} fullWidth>
            {registerData.form.submitLabel}
          </Button>

          <p className={styles.footerText}>
            {registerData.footer.text}{" "}
            <Link href={registerData.footer.linkHref} className={styles.footerLink}>
              {registerData.footer.linkLabel}
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}
