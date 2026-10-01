"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Beef,
  Milk,
  HeartPulse,
  Syringe,
  GitFork,
  Wheat,
  Boxes,
  Users,
  CalendarCheck,
  ShoppingBag,
  Truck,
  Coins,
  UserCheck,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Beef,
  Milk,
  HeartPulse,
  Syringe,
  GitFork,
  Wheat,
  Boxes,
  Users,
  CalendarCheck,
  ShoppingBag,
  Truck,
  Coins,
  UserCheck,
  BarChart3,
  Bell,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#E2E5DF] bg-white flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="h-16 flex items-center px-6 border-b border-[#E2E5DF]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] flex items-center justify-center text-white font-bold">
            DF
          </div>
          <div>
            <span className="font-bold text-[#1F2421] text-base tracking-tight">DairyFlow</span>
            <span className="block text-[10px] text-gray-500 font-medium -mt-1">Smart Dairy OS</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-[#1E3A2F] text-white"
                  : "text-[#1F2421] hover:bg-[#F4F5F0] hover:text-[#1E3A2F]"
              )}
            >
              <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E2E5DF] text-xs text-gray-400 text-center">
        DairyFlow v1.0.0
      </div>
    </aside>
  );
}
