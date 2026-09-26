"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  BookOpen,
  Users,
  MapPin,
  Briefcase,
  Pencil,
  ArrowRight,
  Sparkles,
  RefreshCw,
  UserCheck,
  Award,
} from "lucide-react";
import EditProfileForm from "./components/EditProfileForm/EditProfileForm";
import EnrolledCourses from "./components/EnrolledCourses/EnrolledCourses";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardEnrollments } from "./hooks/useDashboardEnrollments";
import styles from "./Dashboard.module.scss";

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

  function handleProfileUpdated(updatedUser) {
    setUser(updatedUser);
    setIsEditing(false);
  }

  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "SH";
  const userStateText = user?.state ? tStates(user.state) : t("profile.notSet");
  const userOccupationText = user?.occupation ? tOccupations(user.occupation) : t("profile.notSet");
  const userLocationText =
    user?.district && user?.state
      ? `${user.district}, ${userStateText}`
      : user?.district || userStateText;

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        {isLoading ? (
          <div className={styles.skeletonContainer} aria-label="Loading dashboard" role="status">
            <div className={styles.skeletonHero} />
            <div className={styles.skeletonGrid}>
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
            </div>
          </div>
        ) : error ? (
          <section className={styles.errorCard} role="alert">
            <div className={styles.errorIconWrapper}>
              <RefreshCw size={24} />
            </div>
            <h2 className={styles.errorTitle}>{t("errorState.title")}</h2>
            <p className={styles.errorDesc}>{t("errorState.description")}</p>
            <button className={styles.retryBtn} onClick={refreshUser}>
              <RefreshCw size={16} aria-hidden="true" /> {t("errorState.retry")}
            </button>
          </section>
        ) : (
          user && (
            <div className={styles.dashboardLayout}>
              {/* Hero Banner Header */}
              <section className={styles.heroCard}>
                <div className={styles.heroBackgroundPattern} aria-hidden="true" />
                <div className={styles.heroMain}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>{userInitials}</div>
                    <span className={styles.onlineBadge} title="Active Online" />
                  </div>
                  <div className={styles.heroInfo}>
                    <div className={styles.statusPill}>
                      <span className={styles.statusDot} />
                      {t("activeMember")}
                    </div>
                    <h1 className={styles.heroGreeting}>
                      {t("welcome", { name: user.name })}
                    </h1>
                    <p className={styles.heroSubtitle}>{t("subtitle")}</p>
                  </div>
                  <button
                    className={styles.editProfileBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil size={15} aria-hidden="true" />
                    <span>{t("profile.editButton")}</span>
                  </button>
                </div>
              </section>

              {/* Stats Overview Grid */}
              <section className={styles.statsSection} aria-label={t("stats.title")}>
                <div className={styles.statsGrid}>
                  {/* Card 1: Enrolled Courses */}
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconCourse}`}>
                      <BookOpen size={22} aria-hidden="true" />
                    </div>
                    <div className={styles.statMeta}>
                      <span className={styles.statLabel}>{t("stats.enrolledCourses")}</span>
                      <strong className={styles.statValue}>
                        {areEnrollmentsLoading ? "..." : enrollments?.length || 0}
                      </strong>
                    </div>
                  </div>

                  {/* Card 2: SHG Association */}
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconShg}`}>
                      <Users size={22} aria-hidden="true" />
                    </div>
                    <div className={styles.statMeta}>
                      <span className={styles.statLabel}>{t("stats.shgGroup")}</span>
                      <strong className={styles.statValue} title={user.shgName || t("profile.notSet")}>
                        {user.shgName || t("profile.notSet")}
                      </strong>
                    </div>
                  </div>

                  {/* Card 3: Location */}
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconLocation}`}>
                      <MapPin size={22} aria-hidden="true" />
                    </div>
                    <div className={styles.statMeta}>
                      <span className={styles.statLabel}>{t("stats.location")}</span>
                      <strong className={styles.statValue} title={userLocationText}>
                        {userLocationText}
                      </strong>
                    </div>
                  </div>

                  {/* Card 4: Occupation */}
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconOccupation}`}>
                      <Briefcase size={22} aria-hidden="true" />
                    </div>
                    <div className={styles.statMeta}>
                      <span className={styles.statLabel}>{t("stats.occupation")}</span>
                      <strong className={styles.statValue} title={userOccupationText}>
                        {userOccupationText}
                      </strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Action Shortcuts */}
              <section className={styles.shortcutsSection}>
                <h2 className={styles.sectionHeading}>
                  <Sparkles size={18} className={styles.headingIcon} aria-hidden="true" />
                  {t("quickActions.title")}
                </h2>
                <div className={styles.shortcutsGrid}>
                  <Link href="/courses" className={styles.shortcutCard}>
                    <div className={`${styles.shortcutIcon} ${styles.shortcutIconCourse}`}>
                      <BookOpen size={20} />
                    </div>
                    <div className={styles.shortcutContent}>
                      <h3 className={styles.shortcutTitle}>{t("quickActions.exploreCourses")}</h3>
                      <p className={styles.shortcutDesc}>{t("quickActions.exploreCoursesDesc")}</p>
                    </div>
                    <ArrowRight size={18} className={styles.shortcutArrow} />
                  </Link>

                  <Link href="/community" className={styles.shortcutCard}>
                    <div className={`${styles.shortcutIcon} ${styles.shortcutIconCommunity}`}>
                      <Users size={20} />
                    </div>
                    <div className={styles.shortcutContent}>
                      <h3 className={styles.shortcutTitle}>{t("quickActions.community")}</h3>
                      <p className={styles.shortcutDesc}>{t("quickActions.communityDesc")}</p>
                    </div>
                    <ArrowRight size={18} className={styles.shortcutArrow} />
                  </Link>

                  <button
                    onClick={() => setIsEditing(true)}
                    className={`${styles.shortcutCard} ${styles.shortcutCardBtn}`}
                  >
                    <div className={`${styles.shortcutIcon} ${styles.shortcutIconProfile}`}>
                      <UserCheck size={20} />
                    </div>
                    <div className={styles.shortcutContent}>
                      <h3 className={styles.shortcutTitle}>{t("quickActions.updateProfile")}</h3>
                      <p className={styles.shortcutDesc}>{t("quickActions.updateProfileDesc")}</p>
                    </div>
                    <ArrowRight size={18} className={styles.shortcutArrow} />
                  </button>
                </div>
              </section>

              {/* Enrolled Courses */}
              <div className={styles.coursesContainer}>
                <EnrolledCourses
                  enrollments={enrollments}
                  isLoading={areEnrollmentsLoading}
                  hasError={Boolean(enrollmentsError)}
                  t={t}
                />
              </div>

              {/* Edit Profile Modal */}
              {isEditing && (
                <EditProfileForm
                  user={user}
                  onSuccess={handleProfileUpdated}
                  onCancel={() => setIsEditing(false)}
                />
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}