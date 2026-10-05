"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Role, AuthState } from "@/types/auth";
import { apiClient } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth-api";

interface AuthContextType extends AuthState {
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRole: (roles: Role | Role[]) => boolean;
  hasPermission: (permissions: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = apiClient.getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.data) {
        setUser({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          phoneNumber: res.data.phoneNumber,
          roles: res.data.roles,
          permissions: res.data.permissions || [],
          status: (res.data.status as User["status"]) || "ACTIVE",
        });
      }
    } catch {
      apiClient.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    // Listen to unauthorized broadcasts from apiClient
    const handleUnauthorized = () => {
      setUser(null);
      router.push("/login");
    };

    window.addEventListener("dairyflow:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("dairyflow:unauthorized", handleUnauthorized);
    };
  }, [fetchCurrentUser, router]);

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ username, password });
      const authData = res.data;

      if (!authData) {
        throw new Error("Invalid authentication response");
      }

      const loggedInUser: User = {
        id: authData.userId || authData.user?.id || "",
        username: authData.username || authData.user?.username || "",
        email: authData.email || authData.user?.email || "",
        firstName: authData.firstName || authData.user?.firstName,
        lastName: authData.lastName || authData.user?.lastName,
        roles: authData.roles || authData.user?.roles || [],
        permissions: authData.permissions || authData.user?.permissions || [],
        status: (authData.user?.status as User["status"]) || "ACTIVE",
      };

      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const refresh = async () => {
    const refreshToken = apiClient.getRefreshToken();
    if (refreshToken) {
      await authApi.refreshToken(refreshToken);
      await fetchCurrentUser();
    }
  };

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user) return false;
    const required = Array.isArray(roles) ? roles : [roles];
    return required.some((r) => user.roles.includes(r));
  };

  const hasPermission = (permissions: string | string[]): boolean => {
    if (!user) return false;

    // Farm Owner and System Admin have unconditional superuser bypass
    if (user.roles.includes("ROLE_OWNER") || user.roles.includes("ROLE_ADMIN")) {
      return true;
    }

    const required = Array.isArray(permissions) ? permissions : [permissions];
    const userPerms = new Set(user.permissions || []);

    return required.some((perm) => {
      if (userPerms.has(perm)) return true;

      // Check permission aliases
      if (perm === "COW_VIEW" && userPerms.has("COW_READ")) return true;
      if (perm === "COW_READ" && userPerms.has("COW_VIEW")) return true;
      if ((perm === "COW_CREATE" || perm === "COW_UPDATE") && userPerms.has("COW_WRITE")) return true;
      if (perm === "COW_WRITE" && (userPerms.has("COW_CREATE") || userPerms.has("COW_UPDATE"))) return true;

      return false;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        login,
        logout,
        refresh,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
