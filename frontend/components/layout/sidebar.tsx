"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Beef,
  Droplets,
  HeartPulse,
  Wheat,
  Receipt,
  Settings,
  HelpCircle,
  PlusCircle,
  Boxes,
  Users,
  CalendarCheck,
  ShoppingBag,
  Truck,
  BarChart3,
  Bell,
  Syringe,
  GitFork,
  UserCheck,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "danger" | "default";
}

const PRIMARY_NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Herd Management", href: "/cows", icon: Beef },
  { title: "Milk Production", href: "/milk", icon: Droplets },
  { title: "Health & Vet", href: "/health", icon: HeartPulse, badge: "2", badgeVariant: "danger" },
  { title: "Vaccinations", href: "/vaccinations", icon: Syringe },
  { title: "Breeding & AI", href: "/breeding", icon: GitFork },
  { title: "Feed & Ration", href: "/feed", icon: Wheat },
  { title: "Inventory", href: "/inventory", icon: Boxes },
  { title: "Financial Ledger", href: "/finance", icon: Receipt },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Subscriptions", href: "/subscriptions", icon: CalendarCheck },
  { title: "Orders & Sales", href: "/orders", icon: ShoppingBag },
  { title: "Deliveries", href: "/deliveries", icon: Truck },
  { title: "Staff & Shifts", href: "/staff", icon: UserCheck },
  { title: "Reports & Logs", href: "/reports", icon: BarChart3 },
  { title: "Notifications", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen flex flex-col justify-between p-3 border-r border-[#E2E5DF] bg-[#F4F6F2] flex-shrink-0 select-none fixed left-0 top-0 z-30">
      <div className="flex flex-col gap-3">
        {/* Top Branding Section */}
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-lg bg-[#1E3A2F] text-[#92f7c3] flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-[#1E3A2F]/20">
            <Droplets className="w-5 h-5 fill-[#92f7c3]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-[#1E3A2F] truncate tracking-tight font-headline">
              DairyFlow ERP
            </span>
            <span className="text-[11px] text-gray-500 truncate">
              Precision Herd &amp; Lactation
            </span>
          </div>
        </div>

        {/* Quick Bulk Entry CTA */}
        <Link href="/milk">
          <button
            type="button"
            className="w-full bg-white border border-[#E2E5DF] hover:border-[#1E3A2F] text-[#1E3A2F] hover:bg-[#EAECE7] text-xs font-semibold rounded-lg py-1.5 px-3 flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-[#4D6A42]" />
            <span>Quick Bulk Entry</span>
          </button>
        </Link>

        {/* Main Navigation Tabs */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-[#1E3A2F] text-white shadow-sm font-semibold"
                    : "text-gray-700 hover:bg-[#EAECE7] hover:text-[#1E3A2F]"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-[#92f7c3]" : "text-gray-500")} />
                  <span className="truncate">{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] font-bold rounded",
                      item.badgeVariant === "danger"
                        ? "bg-[#FFDAD6] text-[#93000A]"
                        : "bg-gray-200 text-gray-800"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry Status & Utility Links */}
      <div className="pt-2 border-t border-[#E2E5DF] space-y-1">
        <div className="px-3 py-2 bg-white rounded-lg border border-[#E2E5DF] text-[11px] space-y-1 mb-1 shadow-sm">
          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              IoT Telemetry
            </span>
            <span className="text-emerald-700 font-semibold">Online (99.8%)</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span>Parlor Flow</span>
            <span className="font-bold text-[#1F2421]">54.2 L/min</span>
          </div>
        </div>

        <Link
          href="/settings"
          className="text-gray-600 hover:bg-[#EAECE7] hover:text-[#1F2421] rounded-lg px-3 py-1.5 flex items-center gap-2.5 text-xs font-medium transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-500" />
          <span>Facility Settings</span>
        </Link>
        <a
          href="#support"
          className="text-gray-600 hover:bg-[#EAECE7] hover:text-[#1F2421] rounded-lg px-3 py-1.5 flex items-center gap-2.5 text-xs font-medium transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-gray-500" />
          <span>Support Desk</span>
        </a>
      </div>
    </aside>
  );
}
