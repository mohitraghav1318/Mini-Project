import { apiFetch } from "./api";

export function createCourse(payload) {
  return apiFetch("/api/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listCourses() {
  return apiFetch("/api/courses", { method: "GET" });
}

export function createLesson(courseId, payload) {
  return apiFetch(`/api/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}