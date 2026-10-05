"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/providers/auth-provider";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#1E3A2F]/20 border-t-[#1E3A2F] rounded-full animate-spin" />
          <span className="text-xs font-medium text-gray-500 font-headline">Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9F6]">
      <Sidebar />
      <div className="pl-60 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
