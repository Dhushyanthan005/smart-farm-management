"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  Stethoscope,
  Building2,
  AlertTriangle,
  Gauge,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cows?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : "DF";
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.username || "Farm User";
  const primaryRole = user?.roles?.[0]?.replace("ROLE_", "") || "STAFF";

  return (
    <header className="flex justify-between items-center w-full px-6 h-14 bg-white border-b border-[#E2E5DF] shadow-sm flex-shrink-0 z-20 sticky top-0">
      {/* Facility Title & Global Search Bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#1E3A2F]" />
          <h1 className="text-sm font-bold text-[#1E3A2F] tracking-tight font-headline hidden sm:inline">
            Green Valley Organic Dairy - Facility 01
          </h1>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#92f7c3] text-[#00734d]">
            ISO 22000 Cert
          </span>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative w-64 md:w-72 hidden md:block">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cow #tag, lot, or pen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F4F6F2] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F] placeholder:text-gray-400 transition-all"
          />
        </form>
      </div>

      {/* Center Dynamic Telemetry Alerts */}
      <div className="hidden xl:flex items-center gap-2.5">
        <Link
          href="/health"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFDAD6] text-[#93000A] text-[11px] font-semibold hover:opacity-90 transition-opacity"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-ping" />
          <span>Quarantine (2)</span>
        </Link>
        <Link
          href="/health"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold hover:bg-amber-100 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Mastitis Alert</span>
        </Link>
        <Link
          href="/milk"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAECE7] text-gray-700 text-[11px] font-semibold hover:bg-gray-200 transition-colors"
        >
          <Gauge className="w-3.5 h-3.5 text-[#4D6A42]" />
          <span>Tank 04 at 92%</span>
        </Link>
      </div>

      {/* Trailing Action Cluster & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Action "+ Log Milk / Event" */}
        <Link href="/milk">
          <button
            type="button"
            className="h-8 px-3 rounded-lg bg-[#1E3A2F] hover:bg-[#162B23] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Milk / Event</span>
          </button>
        </Link>

        {/* Secondary Action "Dr. Evans (On-Call)" */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F6F2] rounded-lg border border-[#E2E5DF] text-xs">
          <Stethoscope className="w-3.5 h-3.5 text-[#4D6A42]" />
          <span className="text-gray-500 font-normal">On-Call:</span>
          <span className="text-[#1E3A2F] font-semibold">Dr. Evans</span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 border-l border-[#E2E5DF] pl-2">
          <Link
            href="/notifications"
            className="relative p-1.5 text-gray-500 hover:text-[#1F2421] hover:bg-[#EAECE7] rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 border border-white" />
          </Link>
          <button
            type="button"
            className="p-1.5 text-gray-500 hover:text-[#1F2421] hover:bg-[#EAECE7] rounded-lg transition-colors"
            title="Help Desk"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Info & Sign Out */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E5DF]">
          <div className="w-8 h-8 rounded-full bg-[#1E3A2F] text-white border border-[#E2E5DF] flex items-center justify-center font-bold text-xs font-headline">
            {initials}
          </div>
          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-[#1F2421] truncate max-w-[130px]">
              {displayName}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {primaryRole}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of DairyFlow"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
