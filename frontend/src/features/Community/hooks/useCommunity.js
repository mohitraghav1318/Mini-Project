"use client";

import { useEffect, useState } from "react";
import { getCoursePosts } from "../data/community";

export function useCommunity(courseId, enabled) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPosts() {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await getCoursePosts(courseId);
        if (isCurrent) setPosts(response?.data || []);
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadPosts();
    return () => {
      isCurrent = false;
    };
  }, [courseId, enabled]);

  return { posts, setPosts, isLoading, error };
}