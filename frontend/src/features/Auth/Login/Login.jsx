"use client";

import Link from "next/link";

import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Card from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";

import { useTranslations } from "next-intl";
import { useLogin } from "./hooks/useLogin";

import styles from "./Login.module.scss";

export default function Login() {
  const t = useTranslations("login");

  const {
    form,
    fieldErrors,
    formError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useLogin();

  const fields = [
    {
      name: "email",
      type: "email",
    },
    {
      name: "password",
      type: "password",
    },
  ];

  return (
    <AuthLayout
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <Card>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <h1 className={styles.title}>
            {t("title")}
          </h1>

          <FormMessage
            type="error"
            message={formError}
          />

          {fields.map((field) => (
            <Input
              key={field.name}
              name={field.name}
              label={t(`labels.${field.name}`)}
              type={field.type}
              placeholder={t(`placeholders.${field.name}`)}
              value={form[field.name]}
              onChange={handleChange}
              error={fieldErrors[field.name]}
            />
          ))}

          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
          >
            {t("submitLabel")}
          </Button>

          <p className={styles.forgotPasswordText}>
            <Link
              href={t("forgotPassword.linkHref")}
              className={styles.footerLink}
            >
              {t("forgotPassword.text")}
            </Link>
          </p>

          <p className={styles.footerText}>
            {t("footer.text")}{" "}
            <Link
              href={t("footer.linkHref")}
              className={styles.footerLink}
            >
              {t("footer.linkLabel")}
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}
