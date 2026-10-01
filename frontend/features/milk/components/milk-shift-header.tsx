"use client";

import React, { useState } from "react";
import { ChevronRight, Calendar, Sun, Moon, UserCheck, Sliders, ChevronDown } from "lucide-react";

interface MilkShiftHeaderProps {
  onShiftChange?: (shift: "Morning" | "Evening") => void;
  onCalibrate?: () => void;
}

export function MilkShiftHeader({ onShiftChange, onCalibrate }: MilkShiftHeaderProps) {
  const [selectedShift, setSelectedShift] = useState<"Morning" | "Evening">("Morning");

  const handleSelectShift = (shift: "Morning" | "Evening") => {
    setSelectedShift(shift);
    onShiftChange?.(shift);
  };

  return (
    <section className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Shift Scope & Parlor Station Selector */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-[#717973] mr-3 border-r border-[#E2E5DF] pr-4 font-medium">
            <span>Milking Parlor A</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#717973]" />
            <span className="text-[#1E3A2F] font-bold">Rotary 40-Stall Unit</span>
          </div>

          {/* Date Selector Pill */}
          <div className="flex items-center bg-[#F8F9F6] border border-[#E2E5DF] rounded px-3 py-1.5 gap-2 text-[#1F2421]">
            <Calendar className="w-4 h-4 text-[#006c48]" />
            <span className="text-xs font-semibold">Today - Oct 24, 2024</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#717973] cursor-pointer" />
          </div>

          {/* Shift Selection Segmented Switch */}
          <div className="inline-flex rounded-lg border border-[#E2E5DF] bg-[#F8F9F6] p-0.5">
            <button
              type="button"
              onClick={() => handleSelectShift("Morning")}
              className={`px-3 py-1 rounded text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all ${
                selectedShift === "Morning"
                  ? "bg-[#1E3A2F] text-white"
                  : "text-[#717973] hover:text-[#1F2421]"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Morning Shift (04:30 - 08:30)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectShift("Evening")}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                selectedShift === "Evening"
                  ? "bg-[#1E3A2F] text-white"
                  : "text-[#717973] hover:text-[#1F2421]"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evening Shift (15:30 - 19:30)</span>
            </button>
          </div>
        </div>

        {/* Right: Operator Identification & Quick Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F8F9F6] border border-[#E2E5DF] rounded px-3 py-1.5">
            <UserCheck className="w-4 h-4 text-[#1E3A2F]" />
            <div className="text-left">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#717973] leading-tight">
                Parlor Operator
              </div>
              <div className="text-xs font-bold text-[#1E3A2F]">
                Marcus Vance - Lead Herdsman
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCalibrate}
            className="h-9 px-3 bg-[#F8F9F6] hover:bg-[#EAECE7] border border-[#E2E5DF] rounded text-xs font-semibold text-[#1F2421] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-[#717973]" />
            <span>Parlor Calibration</span>
          </button>
        </div>
      </div>
    </section>
  );
}
