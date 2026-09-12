"use client";

import Link from "next/link";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Card from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import { useTranslations } from "next-intl";
import { useLogin } from "./hooks/useLogin";

export default function Login() {
  const t = useTranslations("register");
  const { form, fieldErrors, formError, isSubmitting, handleChange, handleSubmit } =
    useLogin();

  return (
    <AuthLayout heading={t("heading")} subheading={t("subheading")}>
      <Card>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>{t("submitLabel")}</h1>

          <FormMessage type="error" message={formError} />

          {t("form.fields").map((field, index) => (
            <Input
              key={index}
              name={field.name}
              label={t(`form.fields.${index}.label`)}
              type={field.type}
              placeholder={t(`form.fields.${index}.placeholder`)}
              value={form[field.name]}
              onChange={handleChange}
              error={fieldErrors[field.name]}
            />
          ))}

          <Button type="submit" isLoading={isSubmitting} fullWidth>
            {t("form.submitLabel")}
          </Button>

          <p className={styles.forgotPasswordText}>
            <Link href={t("forgotPassword.linkHref")} className={styles.footerLink}>
              {t("forgotPassword.text")}
            </Link>
          </p>

          <p className={styles.footerText}>
            {t("footer.text")}{" "}
            <Link href={t("footer.linkHref")} className={styles.footerLink}>
              {t("footer.linkLabel")}
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}