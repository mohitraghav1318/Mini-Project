"use client";

import { useEffect, useState } from "react";
import { getCourse } from "@/lib/courseApi";

export function useCourseDetail(courseId) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadCourse() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCourse(courseId);
        if (isCurrent) {
          setCourse(response?.data || null);
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

    loadCourse();

    return () => {
      isCurrent = false;
    };
  }, [courseId]);

  return { course, isLoading, error };
}