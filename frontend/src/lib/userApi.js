import { apiFetch } from "./api";

// NOTE: adjust path if your /me route isn't under /api/auth
export function getCurrentUser() {
  return apiFetch("/api/auth/me", { method: "GET" });
}

// Sends only the fields that changed — backend ignores anything not sent.
export function updateProfile(updates) {
  return apiFetch("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}