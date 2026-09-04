"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";

export function useDashboard() {
  const router = useRouter();
  const { user, isLoading, logout, setUser } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  return { user, isLoading, handleLogout: logout, setUser };
}