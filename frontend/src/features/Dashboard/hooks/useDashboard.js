"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/userApi";
import { logoutUser } from "@/lib/authApi";

export function useDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        // adjust if your /me response isn't wrapped as { user: {...} }
        if (isMounted) setUser(data.data);
      } catch (err) {
        if (isMounted) router.push("/login");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      // proceed to login regardless of logout API failure
    } finally {
      router.push("/login");
    }
  }

  return { user, isLoading, isLoggingOut, handleLogout };
}