import Link from "next/link";
import styles from "./AuthLayout.module.scss";
import BorderMotif from "@/components/BorderMotif/BorderMotif";

export default function AuthLayout({ heading, subheading, children }) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.brandPanel}>
        <Link href="/" className={styles.logo}>
          Rural Women Helper
        </Link>

        <div className={styles.brandText}>
          <h2>{heading}</h2>
          <p>{subheading}</p>
        </div>

        <BorderMotif />
      </aside>

      <main className={styles.formPanel}>{children}</main>
    </div>
  );
}
