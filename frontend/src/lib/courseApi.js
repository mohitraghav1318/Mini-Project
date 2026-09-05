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

export async function getCourse(courseId) {
  const response = await listCourses();
  const course = response?.data?.find(
    (item) => String(item.id) === String(courseId),
  );

  return { data: course || null };
}

export function createLesson(courseId, payload) {
  return apiFetch(`/api/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}