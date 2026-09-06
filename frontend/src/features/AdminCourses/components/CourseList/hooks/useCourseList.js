"use client";

import { useEffect, useState } from "react";
import { listCourses } from "@/lib/courseApi";

export function useCourseList(refreshTrigger) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadCourses() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listCourses();
        if (isCurrent) {
          setCourses(response?.data || []);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || null);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isCurrent = false;
    };
  }, [refreshTrigger]);

  return { courses, isLoading, error };
}