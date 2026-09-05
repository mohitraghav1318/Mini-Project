"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import DetailRow from "@/components/DetailRow/DetailRow";
import EditProfileForm from "./components/EditProfileForm/EditProfileForm";
import styles from "./Dashboard.module.scss";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const { user, isLoading, setUser } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("dashboard");
  const tStates = useTranslations("states");
  const tOccupations = useTranslations("occupations");
  const router = useRouter();

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
          user && (
            <>
              <div className={styles.cardsGrid}>
                <Card className={styles.profileCard}>
                  <h2 className={styles.profileTitle}>{t("welcome", { name: user.name })}</h2>
                  <div className={styles.profileDetails}>
                    <DetailRow label={t("profile.shgName")} value={user.shgName} />
                    <DetailRow label={t("profile.district")} value={user.district} />
                    <DetailRow 
                      label={t("profile.state")} 
                      value={user.state ? tStates(user.state) : ""} 
                    />
                    <DetailRow 
                      label={t("profile.occupation")} 
                      value={user.occupation ? tOccupations(user.occupation) : ""} 
                    />
                  </div>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                  >
                    {t("profile.editButton")}
                  </Button>
                </Card>
                <Card className={styles.card}>
                  <h3 className={styles.cardTitle}>{t("courses.title")}</h3>
                  {/* Stub for enrollment status */}
                  {false ? (
                    <>
                      <p className={styles.cardText}>{t("courses.enrolledTitle")}</p>
                      <div className={styles.courseList}>
                        <div className={styles.courseItem}>
                          <span>{t("courses.course1")}</span>
                          <Button 
                            onClick={() => router.push(`/courses/1`)}
                            className={styles.buttonLink}
                          >
                            {t("courses.continue")}
                          </Button>
                        </div>
                        <div className={styles.courseItem}>
                          <span>{t("courses.course2")}</span>
                          <Button 
                            onClick={() => router.push(`/courses/2`)}
                            className={styles.buttonLink}
                          >
                            {t("courses.continue")}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={styles.cardText}>{t("courses.comingSoon")}</p>
                      <Button 
                        onClick={() => router.push(`/courses`)}
                        className={styles.buttonLink}
                      >
                        {t("courses.explore")}
                      </Button>
                    </>
                  )}
                </Card>

              </div>
              {/* Edit Form */}
              {isEditing && (
                <EditProfileForm 
                  user={user} 
                  onSuccess={handleProfileUpdated} 
                  onCancel={() => setIsEditing(false)} 
                />
              )}
            </>
          )
        )}
      </main>
    </div>
  );
}