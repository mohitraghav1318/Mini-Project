"use client";

import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import EditProfileForm from "./components/EditProfileForm/EditProfileForm";
import styles from "./Dashboard.module.scss";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const { user, isLoading, setUser } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);

  function handleProfileUpdated(updatedUser) {
    setUser(updatedUser);
    setIsEditing(false);
  }

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        {isLoading ? (
          <p className={styles.loadingText}>Loading your dashboard...</p>
        ) : (
          user &&
          (isEditing ? (
            <EditProfileForm user={user} onSuccess={handleProfileUpdated} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <ProfileCard user={user} />
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                Edit profile
              </button>
            </>
          ))
        )}
      </main>
    </div>
  );
}