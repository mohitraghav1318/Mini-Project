"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listCourses } from "@/lib/courseApi";

export function useCourses() {
  const { user } = useAuth();
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadCourses() {
      try {
        const response = await listCourses();
        if (isCurrent) {
          setFetchedCourses(response?.data || []);
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

  let courses = fetchedCourses;

  if (user?.occupation) {
    const matchingCourses = [];
    const remainingCourses = [];

    fetchedCourses.forEach((course) => {
      if (course.category === user.occupation) {
        matchingCourses.push(course);
      } else {
        remainingCourses.push(course);
      }
    });

    courses = [...matchingCourses, ...remainingCourses];
  }

  return { courses, isLoading, error };
}