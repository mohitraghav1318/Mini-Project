import { apiFetch } from "./api";

// Fetches the full master list of interests (public route, no auth needed)
export function getAllInterests() {
  return apiFetch("/api/interests", { method: "GET" });
}