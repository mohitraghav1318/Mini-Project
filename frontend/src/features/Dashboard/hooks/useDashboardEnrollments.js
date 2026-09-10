"use client";

import { useEffect, useState } from "react";
import { listMyEnrollments } from "../data/dashboard.data";

export function useDashboardEnrollments(enabled) {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadEnrollments() {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await listMyEnrollments();
        if (isCurrent) {
          setEnrollments(response?.data?.enrollments || []);
        }
      } catch {
        if (isCurrent) {
          setError("load");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadEnrollments();

    return () => {
      isCurrent = false;
    };
  }, [enabled]);

  return { enrollments, isLoading, error };
}
