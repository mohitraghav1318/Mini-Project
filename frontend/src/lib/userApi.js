import { apiFetch } from "./api";

// NOTE: adjust path if your /me route isn't under /api/auth
export function getCurrentUser() {
  return apiFetch("/api/auth/me", { method: "GET" });
}