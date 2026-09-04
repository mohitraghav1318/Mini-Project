"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Card from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import SearchableSelect from "@/components/SearchableSelect/SearchableSelect";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import styles from "./Register.module.scss";
import { OCCUPATION_KEYS, STATE_KEYS } from "./data/register.data";
import { useRegister } from "./hooks/useRegister";

export default function Register() {
  const t = useTranslations("register");
  const tStates = useTranslations("states");
  const tOccupations = useTranslations("occupations");

  const {
    form,
    fieldErrors,
    formError,
    isSubmitting,
    handleChange,
    handleValueChange,
    handleSubmit,
  } = useRegister();

  const stateOptions = STATE_KEYS.map((key) => ({
    value: key,
    label: tStates(key),
  }));

  const occupationOptions = OCCUPATION_KEYS.map((key) => ({
    value: key,
    label: tOccupations(key),
  }));

  return (
    <AuthLayout heading={t("heading")} subheading={t("subheading")}>
      <Card>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>{t("title")}</h1>

          <FormMessage type="error" message={formError} />

          {/* 1. Name */}
          <Input
            name="name"
            label={t("labels.name")}
            type="text"
            placeholder={t("placeholders.name")}
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
          />

          {/* 2. Email */}
          <Input
            name="email"
            label={t("labels.email")}
            type="email"
            placeholder={t("placeholders.email")}
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />

          {/* 3. Password */}
          <Input
            name="password"
            label={t("labels.password")}
            type="password"
            placeholder={t("placeholders.password")}
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
          />

          {/* 4. SHG Name */}
          <Input
            name="shgName"
            label={t("labels.shgName")}
            type="text"
            placeholder={t("placeholders.shgName")}
            required
            value={form.shgName}
            onChange={handleChange}
            error={fieldErrors.shgName}
          />

          {/* 5. District */}
          <Input
            name="district"
            label={t("labels.district")}
            type="text"
            placeholder={t("placeholders.district")}
            required
            value={form.district}
            onChange={handleChange}
            error={fieldErrors.district}
          />

          {/* 6. State */}
          <SearchableSelect
            name="state"
            label={t("labels.state")}
            placeholder={t("placeholders.state")}
            required
            value={form.state}
            onChange={(val) => handleValueChange("state", val)}
            options={stateOptions}
            error={fieldErrors.state}
          />

          {/* 7. Occupation */}
          <SearchableSelect
            name="occupation"
            label={t("labels.occupation")}
            placeholder={t("placeholders.occupation")}
            required
            value={form.occupation}
            onChange={(val) => handleValueChange("occupation", val)}
            options={occupationOptions}
            error={fieldErrors.occupation}
          />

          <Button type="submit" isLoading={isSubmitting} fullWidth>
            {t("submitLabel")}
          </Button>

          <p className={styles.footerText}>
            {t("footer.text")}{" "}
            <Link href="/login" className={styles.footerLink}>
              {t("footer.linkLabel")}
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}
