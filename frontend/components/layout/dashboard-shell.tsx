import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
