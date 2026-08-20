import { apiFetch } from "./api";

// NOTE: adjust these paths if your Express routes differ
export function registerUser({ name, email, password }) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser({ email, password }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logoutUser() {
  return apiFetch("/api/auth/logout", { method: "POST" });
}
