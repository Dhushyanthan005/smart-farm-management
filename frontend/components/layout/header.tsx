"use client";

import React from "react";
import { Bell, User } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-[#E2E5DF] bg-white flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <h2 className="text-sm font-medium text-gray-500">
          Dairy Operations Console
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="p-2 rounded-full text-gray-500 hover:text-[#1E3A2F] hover:bg-[#F8F9F6] transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
        </button>

        <div className="flex items-center space-x-3 border-l border-[#E2E5DF] pl-4">
          <div className="w-8 h-8 rounded-full bg-[#E8EFE5] text-[#1E3A2F] flex items-center justify-center font-medium text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-[#1F2421] leading-none">
              {user ? user.username : "Farm Manager"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.roles?.[0] ? user.roles[0].replace("ROLE_", "") : "OWNER"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
