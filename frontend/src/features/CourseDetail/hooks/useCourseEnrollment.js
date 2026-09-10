"use client";

import { useEffect, useState } from "react";
import {
  enrollInCourse,
  getEnrollmentStatus,
  unenrollFromCourse,
} from "../data/courseEnrollment";

export function useCourseEnrollment(courseId, enabled) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadStatus() {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getEnrollmentStatus(courseId);
        if (isCurrent) {
          setIsEnrolled(Boolean(response?.data?.enrolled));
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

    loadStatus();

    return () => {
      isCurrent = false;
    };
  }, [courseId, enabled]);

  async function toggleEnrollment() {
    setIsMutating(true);
    setError(null);

    try {
      if (isEnrolled) {
        await unenrollFromCourse(courseId);
        setIsEnrolled(false);
      } else {
        await enrollInCourse(courseId);
        setIsEnrolled(true);
      }
    } catch {
      setError(isEnrolled ? "unenroll" : "enroll");
    } finally {
      setIsMutating(false);
    }
  }

  return { isEnrolled, isLoading, isMutating, error, toggleEnrollment };
}
