import { apiFetch } from "@/lib/api";

export function getEnrollmentStatus(courseId) {
  return apiFetch(`/api/courses/${courseId}/enrollment-status`, { method: "GET" });
}

export function enrollInCourse(courseId) {
  return apiFetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
}

export function unenrollFromCourse(courseId) {
  return apiFetch(`/api/courses/${courseId}/enroll`, { method: "DELETE" });
}
