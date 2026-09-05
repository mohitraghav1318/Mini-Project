"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";

export function useAdminCourses() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [isLoading, router, user]);

  return { user, isLoading };
}