import { apiFetch } from "./api";

export function generateCourseOutline(payload) {
  return apiFetch("/api/admin/ai/course-outline", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
