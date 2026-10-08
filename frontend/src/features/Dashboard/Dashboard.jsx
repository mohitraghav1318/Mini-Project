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
  RefreshCw,
  TrendingUp,
  BarChart2,
  Settings,
} from "lucide-react";
import EditProfileForm from "./components/EditProfileForm/EditProfileForm";
import EnrolledCourses from "./components/EnrolledCourses/EnrolledCourses";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardEnrollments } from "./hooks/useDashboardEnrollments";
import { useAdminStats } from "@/features/AdminCourses/hooks/useAdminStats";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const { user, isLoading, error, refreshUser, setUser } = useDashboard();
  const {
    enrollments,
    isLoading: areEnrollmentsLoading,
    error: enrollmentsError,
  } = useDashboardEnrollments(Boolean(user) && !isLoading);
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminStats();
  const [isEditing, setIsEditing] = useState(false);

  const isAdmin = user?.role === "ADMIN";

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

  const maxEnrollments = stats?.courses?.length
    ? Math.max(...stats.courses.map((c) => c.enrollmentCount), 1)
    : 1;

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
                      {isAdmin ? "Administrator" : t("activeMember")}
                    </div>
                    <h1 className={styles.heroGreeting}>
                      {t("welcome", { name: user.name })}
                    </h1>
                    <p className={styles.heroSubtitle}>{t("subtitle")}</p>
                  </div>
                  <div className={styles.heroActions}>
                    <button
                      className={styles.editProfileBtn}
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil size={15} aria-hidden="true" />
                      <span>{t("profile.editButton")}</span>
                    </button>
                    {isAdmin && (
                      <Link href="/admin/courses" className={styles.manageCoursesBtn}>
                        <Settings size={15} aria-hidden="true" />
                        <span>Manage Courses</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </section>

              {/* ── ADMIN PANEL (only for admins) ── */}
              {isAdmin && (
                <section className={styles.adminSection} aria-label="Admin overview">
                  <div className={styles.adminSectionHeader}>
                    <BarChart2 size={20} className={styles.adminSectionIcon} aria-hidden="true" />
                    <h2 className={styles.adminSectionTitle}>Platform Overview</h2>
                  </div>

                  {/* Admin Stat Cards */}
                  {statsLoading ? (
                    <div className={styles.adminStatsGrid}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`${styles.adminStatCard} ${styles.adminStatSkeleton}`} />
                      ))}
                    </div>
                  ) : statsError ? (
                    <p className={styles.adminStatsError}>Could not load stats: {statsError}</p>
                  ) : stats ? (
                    <div className={styles.adminStatsGrid}>
                      {/* Active Courses */}
                      <div className={styles.adminStatCard}>
                        <div className={`${styles.adminStatIcon} ${styles.adminStatIconCourse}`}>
                          <BookOpen size={22} aria-hidden="true" />
                        </div>
                        <div className={styles.adminStatMeta}>
                          <span className={styles.adminStatLabel}>Active Courses</span>
                          <strong className={styles.adminStatValue}>{stats.totalCourses}</strong>
                          <span className={styles.adminStatSub}>currently live</span>
                        </div>
                      </div>

                      {/* Total Enrollments */}
                      <div className={styles.adminStatCard}>
                        <div className={`${styles.adminStatIcon} ${styles.adminStatIconEnroll}`}>
                          <TrendingUp size={22} aria-hidden="true" />
                        </div>
                        <div className={styles.adminStatMeta}>
                          <span className={styles.adminStatLabel}>Total Enrollments</span>
                          <strong className={styles.adminStatValue}>{stats.totalEnrollments}</strong>
                          <span className={styles.adminStatSub}>across all courses</span>
                        </div>
                      </div>

                      {/* Unique Enrolled Users */}
                      <div className={styles.adminStatCard}>
                        <div className={`${styles.adminStatIcon} ${styles.adminStatIconUsers}`}>
                          <Users size={22} aria-hidden="true" />
                        </div>
                        <div className={styles.adminStatMeta}>
                          <span className={styles.adminStatLabel}>Enrolled Users</span>
                          <strong className={styles.adminStatValue}>{stats.totalUniqueEnrolledUsers}</strong>
                          <span className={styles.adminStatSub}>unique learners</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Per-course breakdown */}
                  {!statsLoading && !statsError && stats?.courses?.length > 0 && (
                    <div className={styles.breakdownCard}>
                      <h3 className={styles.breakdownTitle}>Enrollment Breakdown by Course</h3>
                      <ul className={styles.breakdownList}>
                        {stats.courses.map((course) => {
                          const pct = Math.round((course.enrollmentCount / maxEnrollments) * 100);
                          return (
                            <li key={course.id} className={styles.breakdownItem}>
                              <div className={styles.breakdownMeta}>
                                <span className={styles.breakdownCourseName}>{course.title}</span>
                                <span className={styles.breakdownCount}>
                                  {course.enrollmentCount}{" "}
                                  {course.enrollmentCount === 1 ? "user" : "users"}
                                </span>
                              </div>
                              <div
                                className={styles.progressBarTrack}
                                aria-label={`${pct}% of max enrollments`}
                                role="progressbar"
                                aria-valuenow={pct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className={styles.progressBarFill}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* Stats Overview Grid (regular user cards) */}
              {!isAdmin && (
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
              )}

              {/* Enrolled Courses (only for regular users) */}
              {!isAdmin && (
                <div className={styles.coursesContainer}>
                  <EnrolledCourses
                    enrollments={enrollments}
                    isLoading={areEnrollmentsLoading}
                    hasError={Boolean(enrollmentsError)}
                    t={t}
                  />
                </div>
              )}

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