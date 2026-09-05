import { apiFetch } from "./api";

export function createCourse(payload) {
  return apiFetch("/api/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}