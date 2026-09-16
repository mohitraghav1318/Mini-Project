import { useLocale } from "next-intl";
import { getHomeData } from "../data/home.data";

/**
 * Layer 3 — Hook
 * Returns locale-aware home page data. Keeps the container
 * decoupled from the data layer import path.
 */
export function useHomeData() {
  const locale = useLocale();
  return getHomeData(locale);
}
