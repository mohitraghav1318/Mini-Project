import { apiFetch } from "@/lib/api";

export function askDoubt(courseId, payload) {
  return apiFetch(`/api/courses/${courseId}/ask`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
