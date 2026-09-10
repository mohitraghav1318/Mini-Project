"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import EditProfileForm from "./components/EditProfileForm/EditProfileForm";
import styles from "./Dashboard.module.scss";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardEnrollments } from "./hooks/useDashboardEnrollments";

export default function Dashboard() {
  const { user, isLoading, error, refreshUser, setUser } = useDashboard();
  const {
    enrollments,
    isLoading: areEnrollmentsLoading,
    error: enrollmentsError,
  } = useDashboardEnrollments(Boolean(user) && !isLoading);
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
          <div className={styles.skeletonGrid} aria-label="Loading dashboard" role="status">
            <div className={`${styles.skeletonCard} ${styles.skeletonProfile}`}>
              <div className={styles.skeletonHeader}>
                <span className={styles.skeletonAvatar} />
                <div className={styles.skeletonIntro}>
                  <span className={styles.skeletonLineSmall} />
                  <span className={styles.skeletonLineTitle} />
                  <span className={styles.skeletonLineText} />
                </div>
                <span className={styles.skeletonButton} />
              </div>
              <div className={styles.skeletonDetails}>
                <span /><span /><span /><span />
              </div>
            </div>
            <div className={`${styles.skeletonCard} ${styles.skeletonCourse}`}>
              <span className={styles.skeletonCourseTitle} />
              <span className={styles.skeletonCourseText} />
              <span className={styles.skeletonButton} />
            </div>
          </div>
        ) : error ? (
          <section className={styles.errorState} role="alert">
            <h2>We couldn&apos;t load your dashboard</h2>
            <p>Please check your connection and try again.</p>
            <Button onClick={refreshUser}>Try Again</Button>
          </section>
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
                    <span className={styles.courseEyebrow}>{t("courses.eyebrow")}</span>
                    <h3 className={styles.cardTitle}>{t("courses.title")}</h3>
                  </div>
                  {areEnrollmentsLoading ? (
                    <p className={styles.cardText} role="status">{t("courses.loading")}</p>
                  ) : enrollmentsError ? (
                    <p className={styles.cardError} role="alert">{t("courses.error")}</p>
                  ) : enrollments.length > 0 ? (
                    <>
                      <p className={styles.cardText}>
                        {t("courses.enrolledCount", { count: enrollments.length })}
                      </p>
                      <div className={styles.courseList}>
                        {enrollments.map((enrollment) => (
                          <Link
                            className={styles.courseItem}
                            key={enrollment.courseId}
                            href={`/courses/${enrollment.courseId}`}
                          >
                            <span>{enrollment.title}</span>
                            <span className={styles.courseArrow} aria-hidden="true">&#8250;</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={styles.cardText}>{t("courses.empty")}</p>
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