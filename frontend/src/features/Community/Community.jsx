"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
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
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function Community({ courseId }) {
  const t = useTranslations("community");
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { isEnrolled, isLoading: isEnrollmentLoading, error: enrollmentError } = useCourseEnrollment(
    courseId,
    !isAuthLoading && Boolean(user),
  );
  const canView = isAdmin || isEnrolled;
  const { posts, setPosts, isLoading, error } = useCommunity(
    courseId,
    !isAuthLoading && !isEnrollmentLoading && canView,
  );
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const [actionError, setActionError] = useState(null);

  function updateCommentCount(postId, change) {
    setPosts((current) => current.map((post) => (
      post.id === postId
        ? { ...post, _count: { ...post._count, comments: Math.max(0, (post._count?.comments || 0) + change) } }
        : post
    )));
  }

  async function handlePostSubmit(event) {
    event.preventDefault();
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
    setSubmitting(`comment-${postId}`);
    setActionError(null);
    try {
      const response = await createPostComment(postId, commentContent[postId]?.trim() || "");
      setComments((current) => ({ ...current, [postId]: [...(current[postId] || []), response.data] }));
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
      setComments((current) => ({ ...current, [postId]: current[postId].filter((item) => item.id !== comment.id) }));
      updateCommentCount(postId, -1);
    } catch (err) {
      setActionError(err.message);
    }
  }

  function canDelete(authorId) {
    return isAdmin || authorId === user?.id;
  }

  if (isAuthLoading || isEnrollmentLoading) return <p className={styles.status} role="status">{t("loading")}</p>;
  if (enrollmentError) return <p className={styles.error} role="alert">{t("enrollmentError")}</p>;
  if (!canView) {
    return (
      <main className={styles.page}>
        <section className={styles.gate}>
          <h1>{t("title")}</h1>
          <p>{t("gate")}</p>
          <Button onClick={() => router.push(`/courses/${courseId}`)}>{t("backToCourse")}</Button>
        </section>
      </main>
    );
  }
  if (isLoading) return <p className={styles.status} role="status">{t("loading")}</p>;
  if (error) return <p className={styles.error} role="alert">{error}</p>;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </header>
        {!isAdmin && (
          <form className={styles.composer} onSubmit={handlePostSubmit}>
            <textarea value={postContent} onChange={(event) => setPostContent(event.target.value)} placeholder={t("postPlaceholder")} aria-label={t("postPlaceholder")} rows={4} />
            <Button type="submit" disabled={!postContent.trim()} isLoading={submitting === "post"}>{t("postSubmit")}</Button>
          </form>
        )}
        {actionError && <p className={styles.error} role="alert">{actionError}</p>}
        {posts.length === 0 ? <p className={styles.status}>{t("empty")}</p> : (
          <section className={styles.feed} aria-label={t("feedLabel")}>
            {posts.map((post) => (
              <article className={styles.post} key={post.id}>
                <div className={styles.postMeta}><strong>{post.author.name}</strong><time dateTime={post.createdAt}>{formatDate(post.createdAt, locale)}</time></div>
                <p className={styles.content}>{post.content}</p>
                <div className={styles.actions}>
                  <Button variant="secondary" onClick={() => toggleComments(post.id)}>{t("viewComments", { count: post._count?.comments || 0 })}</Button>
                  {canDelete(post.author.id) && <Button variant="secondary" onClick={() => handleDeletePost(post)}>{t("delete")}</Button>}
                </div>
                {expandedPostId === post.id && (
                  <div className={styles.thread}>
                    {commentLoading === post.id ? <p className={styles.status}>{t("commentsLoading")}</p> : (
                      <>
                        {(comments[post.id] || []).map((comment) => (
                          <div className={styles.comment} key={comment.id}>
                            <div className={styles.postMeta}><strong>{comment.author.name}</strong><time dateTime={comment.createdAt}>{formatDate(comment.createdAt, locale)}</time></div>
                            <p className={styles.content}>{comment.content}</p>
                            {canDelete(comment.author.id) && <Button variant="secondary" onClick={() => handleDeleteComment(post.id, comment)}>{t("delete")}</Button>}
                          </div>
                        ))}
                        {!isAdmin && <form className={styles.commentComposer} onSubmit={(event) => handleCommentSubmit(event, post.id)}><textarea value={commentContent[post.id] || ""} onChange={(event) => setCommentContent((current) => ({ ...current, [post.id]: event.target.value }))} placeholder={t("commentPlaceholder")} aria-label={t("commentPlaceholder")} rows={3} /><Button type="submit" disabled={!commentContent[post.id]?.trim()} isLoading={submitting === `comment-${post.id}`}>{t("commentSubmit")}</Button></form>}
                      </>
                    )}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}