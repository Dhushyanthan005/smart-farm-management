"use client";

import React from "react";
import { ArrowUpRight, CheckCircle2, Gauge, RefreshCw, Thermometer, Droplets } from "lucide-react";
import { ShiftMilkSummary, DailyMilkSummary } from "@/types/milk";

interface MilkShiftKpisProps {
  shiftSummary?: ShiftMilkSummary | null;
  dailySummary?: DailyMilkSummary | null;
  isLoading?: boolean;
  onSwitchTank?: () => void;
}

export function MilkShiftKpis({
  shiftSummary,
  dailySummary,
  isLoading,
  onSwitchTank,
}: MilkShiftKpisProps) {
  const totalYield = shiftSummary?.totalYield ?? 0;
  const bulkYield = shiftSummary?.bulkYield ?? 0;
  const withheldYield = shiftSummary?.withheldYield ?? 0;
  const cowsMilked = shiftSummary?.cowsMilked ?? 0;
  const avgYield = shiftSummary?.averageYield ?? 0;
  const highestYield = shiftSummary?.highestYield ?? 0;

  // Visual calculation
  const targetYield = 7500;
  const pacePercent = Math.min(100, Math.round((totalYield / targetYield) * 1000) / 10);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: Shift Yield Target */}
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[#717973] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Total Shift Yield
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {pacePercent > 0 ? `${pacePercent}% Pace` : "Session Standby"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#1E3A2F] font-headline">
              {isLoading ? "..." : `${totalYield.toFixed(1)} L`}
            </span>
            <span className="text-xs text-[#717973]">/ ~7,500 L est</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-[#EAECE7] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006c48] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(pacePercent, totalYield > 0 ? 5 : 0)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#717973] mt-1 font-mono">
            <span>Milked: {cowsMilked} cows</span>
            <span className="text-[#006c48] font-semibold">Bulk: {bulkYield.toFixed(1)} L</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Average Cow Yield / Extraction Flow */}
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[#717973] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Average Yield per Cow
            </span>
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#F8F9F6] text-[#717973]">
              Parlor Avg
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#1E3A2F] font-headline">
              {isLoading ? "..." : `${avgYield.toFixed(1)} L`}
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Optimal
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#E2E5DF] flex items-center justify-between text-[11px] text-[#717973]">
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#006c48]" /> Peak Cow Yield: {highestYield > 0 ? `${highestYield.toFixed(1)} L` : "--"}
          </span>
          <span className="font-mono text-[11px] text-[#1E3A2F] font-medium">
            Withheld: {withheldYield.toFixed(1)} L
          </span>
        </div>
      </div>

      {/* KPI 3: Milk Temp Chiller (Pre-Cold Chain QC) */}
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[#717973] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Plate Chiller Temp
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Pre-Cold Chain
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#1E3A2F] font-headline">3.4°C</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> Compliance OK
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#E2E5DF] flex items-center justify-between text-[11px] text-[#717973]">
          <span className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-blue-600" /> Inline Cooler Return: 2.8°C
          </span>
          <span className="text-[#1E3A2F] font-mono font-medium">Target &lt; 4.0°C</span>
        </div>
      </div>

      {/* KPI 4: Target Bulk Tank Allocation */}
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#717973]">
              Direct Receiving Silo
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-bold text-[#1E3A2F]">Tank 03</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">
                In Flow
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchTank}
            className="px-2 py-1 rounded border border-[#E2E5DF] bg-[#F8F9F6] text-[#1F2421] text-[11px] font-semibold hover:bg-[#EAECE7] flex items-center gap-1 transition-colors"
          >
            <span>Switch Tank</span>
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-2">
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-[#1F2421]">
              Volume: {bulkYield > 0 ? `${Math.round(bulkYield).toLocaleString()} L` : "7,400 L"} / 10,000 L
            </span>
            <span className="font-bold text-[#1E3A2F]">
              {bulkYield > 0 ? `${Math.min(100, Math.round((bulkYield / 10000) * 100))}%` : "74%"}
            </span>
          </div>
          <div className="w-full bg-[#EAECE7] h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-[#1E3A2F] h-full rounded-full transition-all"
              style={{
                width: bulkYield > 0 ? `${Math.min(100, Math.round((bulkYield / 10000) * 100))}%` : "74%",
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#717973] mt-1 font-medium">
            <span>
              Remaining:{" "}
              {bulkYield > 0
                ? `${Math.max(0, 10000 - Math.round(bulkYield)).toLocaleString()} L`
                : "2,600 L"}
            </span>
            <span className="text-[#006c48] font-bold">Agitator: ON</span>
          </div>
        </div>
      </div>
    </section>
  );
}
