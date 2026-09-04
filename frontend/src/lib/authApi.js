import { apiFetch } from "./api";

// NOTE: adjust these paths if your Express routes differ
export function registerUser({ name, email, password, shgName, district, state, occupation }) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, shgName, district, state, occupation }),
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

export function forgotPasswordRequest({ email }) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPasswordRequest({ token, newPassword }) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
