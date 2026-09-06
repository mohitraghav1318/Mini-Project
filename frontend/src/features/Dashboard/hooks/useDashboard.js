"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";

export function useDashboard() {
  const router = useRouter();
  const { user, isLoading, error, refreshUser, logout, setUser } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.push("/login");
    }
  }, [isLoading, user, error, router]);

  return { user, isLoading, error, refreshUser, handleLogout: logout, setUser };
}