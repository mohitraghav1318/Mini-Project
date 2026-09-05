import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
// import styles from "../dashboard.module.scss";

export default function CoursesPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("courses.title")}</h1>
        <p className={styles.description}>{t("courses.placeholder")}</p>
        <Button 
          onClick={() => router.push(`/dashboard`)}
          className={styles.button}
        >
          {t("backToDashboard")}
        </Button>
      </div>
    </main>
  );
}