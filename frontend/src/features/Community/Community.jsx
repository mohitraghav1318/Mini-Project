"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  MessageSquare,
  Send,
  Trash2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Briefcase,
  Users,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCourseEnrollment } from "@/features/CourseDetail/hooks/useCourseEnrollment";
import {
  createCoursePost,
  createPostComment,
  deleteComment,
  deletePost,
  getPostComments,
} from "./data/community";
import { useCommunity } from "./hooks/useCommunity";
import styles from "./Community.module.scss";

function formatDate(value, locale) {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getInitials(name) {
  if (!name) return "SH";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Community({ courseId = 1 }) {
  const t = useTranslations("community");
  const tStates = useTranslations("states");
  const tOccupations = useTranslations("occupations");
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { isEnrolled, isLoading: isEnrollmentLoading, error: enrollmentError } = useCourseEnrollment(
    courseId,
    !isAuthLoading && Boolean(user)
  );

  const canView = isAdmin || isEnrolled || !courseId;
  const { posts, setPosts, isLoading, error } = useCommunity(
    courseId,
    !isAuthLoading && !isEnrollmentLoading && canView
  );

  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const [actionError, setActionError] = useState(null);

  function updateCommentCount(postId, change) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              _count: {
                ...post._count,
                comments: Math.max(0, (post._count?.comments || 0) + change),
              },
            }
          : post
      )
    );
  }

  async function handlePostSubmit(event) {
    event.preventDefault();
    if (!postContent.trim()) return;
    setSubmitting("post");
    setActionError(null);
    try {
      const response = await createCoursePost(courseId, postContent.trim());
      setPosts((current) => [response.data, ...current]);
      setPostContent("");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(null);
    }
  }

  async function toggleComments(postId) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (comments[postId]) return;
    setCommentLoading(postId);
    setActionError(null);
    try {
      const response = await getPostComments(postId);
      setComments((current) => ({ ...current, [postId]: response.data || [] }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCommentLoading(null);
    }
  }

  async function handleCommentSubmit(event, postId) {
    event.preventDefault();
    const content = commentContent[postId]?.trim();
    if (!content) return;
    setSubmitting(`comment-${postId}`);
    setActionError(null);
    try {
      const response = await createPostComment(postId, content);
      setComments((current) => ({
        ...current,
        [postId]: [...(current[postId] || []), response.data],
      }));
      updateCommentCount(postId, 1);
      setCommentContent((current) => ({ ...current, [postId]: "" }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(null);
    }
  }

  async function handleDeletePost(post) {
    if (!window.confirm(t("confirm.deletePost"))) return;
    try {
      await deletePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDeleteComment(postId, comment) {
    if (!window.confirm(t("confirm.deleteComment"))) return;
    try {
      await deleteComment(comment.id);
      setComments((current) => ({
        ...current,
        [postId]: (current[postId] || []).filter((item) => item.id !== comment.id),
      }));
      updateCommentCount(postId, -1);
    } catch (err) {
      setActionError(err.message);
    }
  }

  function canDelete(authorId) {
    return isAdmin || authorId === user?.id;
  }

  if (isAuthLoading || isEnrollmentLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonFeed} />
        </div>
      </main>
    );
  }

  if (enrollmentError) {
    return <p className={styles.error} role="alert">{t("enrollmentError")}</p>;
  }

  if (!canView) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.gateCard}>
            <Users size={36} className={styles.gateIcon} />
            <h1>{t("title")}</h1>
            <p>{t("gate")}</p>
            <button
              className={styles.backBtn}
              onClick={() => router.push(`/courses/${courseId}`)}
            >
              <ArrowLeft size={16} /> {t("backToCourse")}
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonFeed} />
        </div>
      </main>
    );
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  const currentUserInitials = getInitials(user?.name);
  const userStateText = user?.state ? tStates(user.state) : null;
  const userOccupationText = user?.occupation ? tOccupations(user.occupation) : null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* User Profile Banner Header */}
        <section className={styles.profileBanner}>
          <div className={styles.bannerPattern} aria-hidden="true" />
          <div className={styles.bannerContent}>
            <div className={styles.userAvatarWrapper}>
              <div className={styles.userAvatar}>{currentUserInitials}</div>
              <span className={styles.onlineDot} title="Online" />
            </div>

            <div className={styles.userInfoBlock}>
              <div className={styles.roleTag}>
                {isAdmin ? (
                  <>
                    <ShieldCheck size={14} /> {t("adminRole")}
                  </>
                ) : (
                  <>
                    <Users size={14} /> {t("shgMember")}
                  </>
                )}
              </div>
              <h1 className={styles.userName}>{user?.name}</h1>
              <p className={styles.userSubtitle}>
                {user?.shgName ? `${user.shgName} · ` : ""}
                {user?.district ? `${user.district}, ` : ""}
                {userStateText || "Community Member"}
              </p>

              {(userOccupationText || user?.district) && (
                <div className={styles.userMetaBadges}>
                  {userOccupationText && (
                    <span className={styles.metaPill}>
                      <Briefcase size={13} /> {userOccupationText}
                    </span>
                  )}
                  {user?.district && (
                    <span className={styles.metaPill}>
                      <MapPin size={13} /> {user.district}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Create Post Composer Form */}
        {!isAdmin && (
          <section className={styles.composerCard}>
            <div className={styles.composerHeader}>
              <div className={styles.composerAvatar}>{currentUserInitials}</div>
              <div className={styles.composerTitleWrapper}>
                <h2 className={styles.composerTitle}>{t("title")}</h2>
                <p className={styles.composerSubtitle}>{t("description")}</p>
              </div>
            </div>

            <form onSubmit={handlePostSubmit}>
              <textarea
                className={styles.postTextarea}
                value={postContent}
                onChange={(event) => setPostContent(event.target.value)}
                placeholder={t("postPlaceholder")}
                aria-label={t("postPlaceholder")}
                rows={3}
              />
              <div className={styles.composerFooter}>
                <button
                  type="submit"
                  className={styles.publishBtn}
                  disabled={!postContent.trim() || submitting === "post"}
                >
                  <Send size={16} aria-hidden="true" />
                  <span>{submitting === "post" ? "Posting..." : t("postSubmit")}</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {actionError && <p className={styles.error} role="alert">{actionError}</p>}

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className={styles.emptyCard}>
            <MessageSquare size={32} className={styles.emptyIcon} />
            <p className={styles.emptyText}>{t("empty")}</p>
          </div>
        ) : (
          <section className={styles.feed} aria-label={t("feedLabel")}>
            {posts.map((post) => {
              const authorInitials = getInitials(post.author?.name);
              const isExpanded = expandedPostId === post.id;
              const commentCount = post._count?.comments || 0;

              return (
                <article className={styles.postCard} key={post.id}>
                  {/* Post Header with Author Profile */}
                  <div className={styles.postHeader}>
                    <div className={styles.authorWrapper}>
                      <div className={styles.authorAvatar}>{authorInitials}</div>
                      <div className={styles.authorMeta}>
                        <div className={styles.authorNameRow}>
                          <strong className={styles.authorName}>{post.author?.name}</strong>
                          {post.author?.id === user?.id && (
                            <span className={styles.youBadge}>You</span>
                          )}
                        </div>
                        <time className={styles.postTime} dateTime={post.createdAt}>
                          <Clock size={12} aria-hidden="true" />
                          {formatDate(post.createdAt, locale)}
                        </time>
                      </div>
                    </div>

                    {canDelete(post.author?.id) && (
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDeletePost(post)}
                        title={t("delete")}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Post Body Content */}
                  <div className={styles.postBody}>
                    <p className={styles.postContent}>{post.content}</p>
                  </div>

                  {/* Post Footer Actions */}
                  <div className={styles.postActions}>
                    <button
                      type="button"
                      className={`${styles.commentToggleBtn} ${
                        isExpanded ? styles.commentToggleBtnActive : ""
                      }`}
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle size={16} />
                      <span>{t("viewComments", { count: commentCount })}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Threaded Comments Section */}
                  {isExpanded && (
                    <div className={styles.commentThread}>
                      {commentLoading === post.id ? (
                        <p className={styles.commentsLoadingStatus}>{t("commentsLoading")}</p>
                      ) : (
                        <>
                          <div className={styles.commentList}>
                            {(comments[post.id] || []).map((comment) => {
                              const commentAuthorInitials = getInitials(comment.author?.name);
                              return (
                                <div className={styles.commentItem} key={comment.id}>
                                  <div className={styles.commentAvatar}>
                                    {commentAuthorInitials}
                                  </div>
                                  <div className={styles.commentBodyWrapper}>
                                    <div className={styles.commentHeader}>
                                      <strong className={styles.commentAuthor}>
                                        {comment.author?.name}
                                      </strong>
                                      <time
                                        className={styles.commentTime}
                                        dateTime={comment.createdAt}
                                      >
                                        <Clock size={11} aria-hidden="true" />
                                        {formatDate(comment.createdAt, locale)}
                                      </time>
                                      {canDelete(comment.author?.id) && (
                                        <button
                                          type="button"
                                          className={styles.deleteCommentBtn}
                                          onClick={() => handleDeleteComment(post.id, comment)}
                                          title={t("delete")}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      )}
                                    </div>
                                    <p className={styles.commentText}>{comment.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Write Comment Form */}
                          {!isAdmin && (
                            <form
                              className={styles.commentForm}
                              onSubmit={(event) => handleCommentSubmit(event, post.id)}
                            >
                              <div className={styles.commentUserAvatar}>
                                {currentUserInitials}
                              </div>
                              <input
                                type="text"
                                className={styles.commentInput}
                                value={commentContent[post.id] || ""}
                                onChange={(event) =>
                                  setCommentContent((current) => ({
                                    ...current,
                                    [post.id]: event.target.value,
                                  }))
                                }
                                placeholder={t("commentPlaceholder")}
                                aria-label={t("commentPlaceholder")}
                              />
                              <button
                                type="submit"
                                className={styles.commentSubmitBtn}
                                disabled={
                                  !commentContent[post.id]?.trim() ||
                                  submitting === `comment-${post.id}`
                                }
                              >
                                <Send size={15} />
                              </button>
                            </form>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}