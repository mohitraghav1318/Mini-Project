"use client";

import DashboardHeader from "./components/DashboardHeader";
import ProfileCard from "./components/ProfileCard";
import styles from "./Dashboard.module.scss";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const { user, isLoading, isLoggingOut, handleLogout } = useDashboard();

  return (
    <div className={styles.page}>
      <DashboardHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      <main className={styles.content}>
        {isLoading ? (
          <p className={styles.loadingText}>Loading your dashboard...</p>
        ) : (
          user && <ProfileCard user={user} />
        )}
      </main>
    </div>
  );
}