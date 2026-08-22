"use client";

import { useEffect, useState } from "react";
import { getAllInterests } from "@/lib/interestApi";

// Fetches the full interest list once. Filtering/searching happens
// client-side in the component using this data, since the list is small.
export function useInterests() {
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchInterests() {
      try {
        const response = await getAllInterests();
        // Backend wraps data as { success, data }, matching your other endpoints
        if (isMounted) setInterests(response.data ?? []);
      } catch (err) {
        if (isMounted) setInterests([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchInterests();
    return () => {
      isMounted = false;
    };
  }, []);

  return { interests, isLoading };
}