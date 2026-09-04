"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "@/lib/userApi";
import { logoutUser as apiLogoutUser } from "@/lib/authApi";
import { useRouter } from "@/i18n/navigation";

const AuthContext = createContext({
  user: null,
  isLoading: true,
  refreshUser: async () => null,
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      const userData = data?.data || null;
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogoutUser();
    } catch (err) {
      // Proceed with local logout regardless of API failure
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
