"use client";

import React from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useDailyMilkSummary } from "@/features/milk/hooks/use-milk";
import { useCowStats } from "@/features/cows/hooks/use-cows";

export function OperationsKpis() {
  const { data: dailyMilkRes } = useDailyMilkSummary();
  const { data: cowStatsRes } = useCowStats();

  const dailyYield = dailyMilkRes?.data?.totalLiters && dailyMilkRes.data.totalLiters > 0
    ? dailyMilkRes.data.totalLiters.toLocaleString()
    : "14,820";

  const avgYield = dailyMilkRes?.data?.averageYield && dailyMilkRes.data.averageYield > 0
    ? dailyMilkRes.data.averageYield.toFixed(1)
    : "36.0";

  const inMilkCount = cowStatsRes?.data?.inMilk && cowStatsRes.data.inMilk > 0
    ? cowStatsRes.data.inMilk
    : 412;

  const totalHeadCount = cowStatsRes?.data?.totalHead && cowStatsRes.data.totalHead > 0
    ? cowStatsRes.data.totalHead
    : 450;
  const sparklineDays = [
    { label: "Day 1", val: "13,920L", height: "45%" },
    { label: "Day 2", val: "14,100L", height: "60%" },
    { label: "Day 3", val: "14,050L", height: "55%" },
    { label: "Day 4", val: "14,340L", height: "70%" },
    { label: "Day 5", val: "14,200L", height: "65%" },
    { label: "Day 6", val: "14,600L", height: "85%" },
    { label: "Today", val: "14,820L", height: "98%" },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Daily Milk Collected */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#414844] uppercase tracking-wider">
              Daily Milk Collected
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#F4F6F2] text-[10px] font-semibold text-[#414844]">
              Last 24h
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-[#1F2421] font-headline">{dailyYield}</span>
            <span className="text-xs font-semibold text-[#414844]">L</span>
            <span className="inline-flex items-center text-xs font-semibold text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#86EFAC] ml-auto">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +3.8%
            </span>
          </div>

          {/* Composition Telemetry Sub-row */}
          <div className="flex items-center justify-between text-xs text-[#414844] border-t border-[#E2E5DF]/60 pt-2 mt-1">
            <span>Fat: <strong className="text-[#1F2421]">3.92%</strong></span>
            <span className="text-[#717973]">•</span>
            <span>Protein: <strong className="text-[#1F2421]">3.35%</strong></span>
            <span className="text-[#717973]">•</span>
            <span className="text-[#006c48] font-semibold">Grade A</span>
          </div>
        </div>

        {/* Sparkline Indicator */}
        <div className="mt-3 pt-2 flex items-end gap-1 h-8 w-full border-t border-[#E2E5DF]/40">
          {sparklineDays.map((day, idx) => {
            const isToday = idx === sparklineDays.length - 1;
            return (
              <div
                key={day.label}
                className="flex-1 flex flex-col justify-end h-full group relative cursor-pointer"
              >
                <div
                  className={`w-full rounded-t-xs transition-colors ${
                    isToday ? "bg-[#1E3A2F]" : "bg-[#1E3A2F]/20 hover:bg-[#1E3A2F]/50"
                  }`}
                  style={{ height: day.height }}
                  title={`${day.label}: ${day.val}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 2: Milking Herd Count */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#414844] uppercase tracking-wider">
              Milking Herd Count
            </span>
            <span className="text-xs font-bold text-[#006c48]">91.5% Capacity</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-3xl font-bold text-[#1F2421] font-headline">{inMilkCount}</span>
            <span className="text-sm font-medium text-[#414844]">/ {totalHeadCount} Active</span>
          </div>

          {/* Segmented distribution breakdown */}
          <div className="w-full bg-[#EAECE7] rounded-full h-2 flex overflow-hidden my-2.5">
            <div className="bg-[#1E3A2F] h-full" style={{ width: "86%" }} title={`Active Milkers (${inMilkCount})`} />
            <div className="bg-amber-400 h-full" style={{ width: "8%" }} title="Dry Cows (28)" />
            <div className="bg-red-500 h-full" style={{ width: "6%" }} title="Sick Bay / Quarantined (10)" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#414844] pt-2 border-t border-[#E2E5DF]/60">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1E3A2F]" /> {inMilkCount} Milking
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> 28 Dry
          </span>
          <span className="flex items-center gap-1 font-semibold text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-600" /> 10 Sick
          </span>
        </div>
      </div>

      {/* Card 3: Average Yield per Cow */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#414844] uppercase tracking-wider">
              Average Yield / Cow
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#F4F6F2] text-[10px] font-semibold text-[#414844]">
              Target: 35.5 L
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-[#1F2421] font-headline">{avgYield}</span>
            <span className="text-xs font-semibold text-[#414844]">L / day</span>
            <span className="inline-flex items-center text-xs font-semibold text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#86EFAC] ml-auto">
              +0.5 L surplus
            </span>
          </div>
          <p className="text-xs text-[#414844]">
            Top String: <strong className="text-[#1F2421]">String 01 (38.4 L/cow)</strong>
          </p>
        </div>

        <div className="bg-[#F8F9F6] p-2 rounded-lg border border-[#E2E5DF] text-[11px] flex items-center justify-between text-[#414844] mt-2">
          <span>Peak Lactation (Days 45-90):</span>
          <span className="font-bold text-[#1E3A2F]">42.1 L/day</span>
        </div>
      </div>

      {/* Card 4: Live Bulk Tank Storage */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#414844] uppercase tracking-wider">
              Bulk Tank Storage
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold animate-pulse">
              Tank 04 at 92%
            </span>
          </div>

          {/* Tank Level Indicators */}
          <div className="grid grid-cols-4 gap-2 my-2 text-center">
            {/* Tank 01 */}
            <div className="space-y-1">
              <div className="h-14 w-full bg-[#F4F6F2] rounded border border-[#E2E5DF] flex flex-col justify-end p-0.5 overflow-hidden">
                <div className="w-full bg-[#006c48] rounded-xs transition-all" style={{ height: "64%" }} />
              </div>
              <span className="text-[10px] font-bold text-[#414844] block">T-01 (64%)</span>
            </div>
            {/* Tank 02 */}
            <div className="space-y-1">
              <div className="h-14 w-full bg-[#F4F6F2] rounded border border-[#E2E5DF] flex flex-col justify-end p-0.5 overflow-hidden">
                <div className="w-full bg-[#006c48] rounded-xs transition-all" style={{ height: "78%" }} />
              </div>
              <span className="text-[10px] font-bold text-[#414844] block">T-02 (78%)</span>
            </div>
            {/* Tank 03 */}
            <div className="space-y-1">
              <div className="h-14 w-full bg-[#F4F6F2] rounded border border-[#E2E5DF] flex flex-col justify-end p-0.5 overflow-hidden">
                <div className="w-full bg-[#006c48] rounded-xs transition-all" style={{ height: "42%" }} />
              </div>
              <span className="text-[10px] font-bold text-[#414844] block">T-03 (42%)</span>
            </div>
            {/* Tank 04 (Warning) */}
            <div className="space-y-1">
              <div className="h-14 w-full bg-red-50 rounded border border-red-400 flex flex-col justify-end p-0.5 overflow-hidden">
                <div className="w-full bg-red-600 rounded-xs animate-pulse" style={{ height: "92%" }} />
              </div>
              <span className="text-[10px] font-bold text-red-600 block">T-04 (92%)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#414844] pt-1 border-t border-[#E2E5DF]/60">
          <span>Hauler Pickup ETA:</span>
          <span className="font-bold text-[#1F2421]">15:30 (Valley Logistics)</span>
        </div>
      </div>
    </section>
  );
}
