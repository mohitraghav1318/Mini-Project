"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
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
                  <div className={styles.profileHeader}>
                    <div className={styles.avatar}>{user.name?.slice(0, 2).toUpperCase()}</div>
                    <div className={styles.profileIntro}>
                      <span className={styles.memberStatus}>Active Member</span>
                      <h2 className={styles.profileTitle}>{t("welcome", { name: user.name })}</h2>
                      <p className={styles.profileSubtitle}>Access your SHG information and learning resources</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)} className={styles.editButton}>
                      <span aria-hidden="true">&#9998;</span> {t("profile.editButton")}
                    </Button>
                  </div>
                  <div className={styles.profileDetails}>
                    <div className={styles.detailTile}>
                      <span>{t("profile.shgName")}</span>
                      <strong>{user.shgName || "—"}</strong>
                    </div>
                    <div className={styles.detailTile}>
                      <span>{t("profile.district")}</span>
                      <strong>{user.district || "—"}</strong>
                    </div>
                    <div className={styles.detailTile}>
                      <span>{t("profile.state")}</span>
                      <strong>{user.state ? tStates(user.state) : "—"}</strong>
                    </div>
                    <div className={styles.detailTile}>
                      <span>{t("profile.occupation")}</span>
                      <strong>{user.occupation ? tOccupations(user.occupation) : "—"}</strong>
                    </div>
                  </div>
                </Card>
                <Card className={styles.courseCard}>
                  <div>
                    <span className={styles.courseEyebrow}>Empowerment &amp; Skills</span>
                    <h3 className={styles.cardTitle}>{t("courses.title")}</h3>
                  </div>
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
                      <Button onClick={() => router.push(`/courses`)} className={styles.buttonLink}>
                        {t("courses.explore")}
                        <span aria-hidden="true">&#8250;</span>
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