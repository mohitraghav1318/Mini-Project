"use client";

import { useEffect, useState } from "react";
import { listCourses } from "@/lib/courseApi";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadCourses() {
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
  }, []);

  return { courses, isLoading, error };
}