"use client";

import React, { useState } from "react";
import { Calendar, Sun, Moon, PlusCircle, AlertTriangle, Share2 } from "lucide-react";

interface OperationsHeaderControlsProps {
  onLogMilkingBatch?: () => void;
  onReportHealthIssue?: () => void;
  onExportLog?: () => void;
}

export function OperationsHeaderControls({
  onLogMilkingBatch,
  onReportHealthIssue,
  onExportLog,
}: OperationsHeaderControlsProps) {
  const [selectedShift, setSelectedShift] = useState<"AM" | "PM">("AM");

  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E2E5DF]">
      <div>
        {/* Visual Breadcrumbs & Herd Scopes */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#414844] mb-1">
          <span>Facility Alpha</span>
          <span className="text-[#717973]">/</span>
          <span>Milking Strings 01 &amp; 02</span>
          <span className="text-[#717973]">/</span>
          <span className="text-[#1E3A2F] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c48]"></span>
            Live Operations Dashboard
          </span>
        </div>
        <h2 className="text-2xl lg:text-[28px] font-bold text-[#1E3A2F] tracking-tight font-headline">
          Main Farm &amp; Operations Center
        </h2>
      </div>

      {/* Controls: Date Picker, Shift Selector, Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Picker Button */}
        <div className="flex items-center bg-white border border-[#E2E5DF] rounded-lg px-3 py-1.5 shadow-sm text-xs font-semibold text-[#1F2421]">
          <Calendar className="w-4 h-4 mr-2 text-[#717973]" />
          <span>Today, Oct 24, 2024</span>
        </div>

        {/* Shift Selector Pill (AM / PM Shift) */}
        <div className="inline-flex bg-[#EAECE7] rounded-lg p-0.5 border border-[#E2E5DF] text-xs font-medium">
          <button
            type="button"
            onClick={() => setSelectedShift("AM")}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
              selectedShift === "AM"
                ? "bg-white text-[#1E3A2F] font-bold shadow-sm"
                : "text-[#414844] hover:text-[#1F2421]"
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${selectedShift === "AM" ? "text-amber-500 fill-amber-400" : "text-gray-400"}`} />
            <span>AM Shift</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedShift("PM")}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
              selectedShift === "PM"
                ? "bg-white text-[#1E3A2F] font-bold shadow-sm"
                : "text-[#414844] hover:text-[#1F2421]"
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${selectedShift === "PM" ? "text-indigo-600 fill-indigo-500" : "text-gray-400"}`} />
            <span>PM Shift</span>
          </button>
        </div>

        {/* Quick Action Buttons */}
        <button
          type="button"
          onClick={onLogMilkingBatch}
          className="h-9 px-3.5 rounded-lg bg-[#1E3A2F] hover:bg-[#1b4332] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Log Milking Batch</span>
        </button>

        <button
          type="button"
          onClick={onReportHealthIssue}
          className="h-9 px-3.5 rounded-lg bg-white border border-red-300 hover:bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>+ Report Health Issue</span>
        </button>

        <button
          type="button"
          onClick={onExportLog}
          className="h-9 px-3 rounded-lg bg-white border border-[#E2E5DF] hover:bg-[#F8F9F6] text-[#1F2421] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          title="Export Daily Log"
        >
          <Share2 className="w-4 h-4 text-[#717973]" />
          <span className="hidden sm:inline">Export Log</span>
        </button>
      </div>
    </section>
  );
}
