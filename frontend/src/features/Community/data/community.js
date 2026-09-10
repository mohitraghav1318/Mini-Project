import { apiFetch } from "@/lib/api";

export function getCoursePosts(courseId) {
  return apiFetch(`/api/courses/${courseId}/posts`, { method: "GET" });
}

export function createCoursePost(courseId, content) {
  return apiFetch(`/api/courses/${courseId}/posts`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function deletePost(postId) {
  return apiFetch(`/api/posts/${postId}`, { method: "DELETE" });
}

export function getPostComments(postId) {
  return apiFetch(`/api/posts/${postId}/comments`, { method: "GET" });
}

export function createPostComment(postId, content) {
  return apiFetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function deleteComment(commentId) {
  return apiFetch(`/api/comments/${commentId}`, { method: "DELETE" });
}