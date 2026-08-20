"use client";

import Button from "@/components/Button/Button";
import styles from "./DashboardHeader.module.scss";

export default function DashboardHeader({ onLogout, isLoggingOut }) {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>Rural Women Helper</span>
      <Button variant="secondary" onClick={onLogout} isLoading={isLoggingOut}>
        Log out
      </Button>
    </header>
  );
}