"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LiveAlertTicker } from "@/features/dashboard/components/live-alert-ticker";
import { OperationsHeaderControls } from "@/features/dashboard/components/operations-header-controls";
import { OperationsKpis } from "@/features/dashboard/components/operations-kpis";
import { ProductionTrendChart } from "@/features/dashboard/components/production-trend-chart";
import { RotaryParlorTelemetry } from "@/features/dashboard/components/rotary-parlor-telemetry";
import { UrgentHealthWatchlist } from "@/features/dashboard/components/urgent-health-watchlist";
import { ScheduledVetRounds } from "@/features/dashboard/components/scheduled-vet-rounds";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogMilkingBatch = () => {
    router.push("/milk");
  };

  const handleReportHealthIssue = () => {
    router.push("/health");
  };

  const handleExportLog = () => {
    // Generate CSV or notify user
    const csvContent = "data:text/csv;charset=utf-8,Date,Shift,Yield_Liters,SCC,AvgYield\n2024-10-24,AM,7420,112000,36.0\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daily_operations_log_2024-10-24.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIsolateCow = (cowTag: string) => {
    router.push(`/health?action=isolate&cow=${encodeURIComponent(cowTag)}`);
  };

  const handleReviewCmt = (cowTag: string) => {
    router.push(`/health?action=cmt&cow=${encodeURIComponent(cowTag)}`);
  };

  const handleConfirmPen = (cowTag: string) => {
    router.push(`/cows?action=maternity&cow=${encodeURIComponent(cowTag)}`);
  };

  const handleOpenProtocol = () => {
    router.push("/health");
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Live System Ticker Bar */}
      <LiveAlertTicker />

      {/* Main Operations Canvas */}
      <div className="p-6 space-y-5 bg-[#F8F9F6]">
        {/* SECTION A: Executive Header & Context Controls */}
        <OperationsHeaderControls
          onLogMilkingBatch={handleLogMilkingBatch}
          onReportHealthIssue={handleReportHealthIssue}
          onExportLog={handleExportLog}
        />

        {/* SECTION B: 4 High-Density Metric KPI Cards */}
        <OperationsKpis />

        {/* SECTION C: Main Workspace Two-Column Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Production Trends & Rotary Telemetry (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <ProductionTrendChart />
            <RotaryParlorTelemetry />
          </div>

          {/* RIGHT COLUMN: Urgent Health & Scheduled Vet Rounds (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <UrgentHealthWatchlist
              onIsolateCow={handleIsolateCow}
              onReviewCmt={handleReviewCmt}
              onConfirmPen={handleConfirmPen}
            />
            <ScheduledVetRounds onOpenProtocol={handleOpenProtocol} />
          </div>
        </section>
      </div>
    </div>
  );
}
