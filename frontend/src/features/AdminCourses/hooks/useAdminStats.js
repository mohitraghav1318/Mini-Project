"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/courseApi";

export function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadStats() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAdminStats();
        if (isCurrent) {
          setStats(response?.data || null);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || "Failed to load stats.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isCurrent = false;
    };
  }, []);

  return { stats, isLoading, error };
}
