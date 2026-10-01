"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthState } from "@/types/auth";
import { apiClient } from "@/lib/api/client";

interface AuthContextType extends AuthState {
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial token check on client mount
    const token = typeof window !== "undefined" ? localStorage.getItem("dairyflow_access_token") : null;
    if (token) {
      // In production phase 3: validate with backend /auth/me
      // For baseline, initialize session state
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    apiClient.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        logout,
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
