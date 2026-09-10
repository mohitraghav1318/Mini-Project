import { apiFetch } from "@/lib/api";

export function listMyEnrollments() {
  return apiFetch("/api/users/me/enrollments", { method: "GET" });
}
