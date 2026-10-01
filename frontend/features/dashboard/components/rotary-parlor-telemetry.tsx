"use client";

import React from "react";
import { RotateCw, CheckCircle2, AlertTriangle } from "lucide-react";

export function RotaryParlorTelemetry() {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#E2E5DF] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1F2421] font-headline">
            Active Milking Shifts Telemetry
          </h3>
          <p className="text-xs text-[#717973]">
            Real-time throughput for automated rotary parlors
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F0FDF4] text-[#15803D] border border-[#86EFAC] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#006c48] animate-pulse" />
          Both Rotaries Active
        </span>
      </div>

      {/* Parlor Rotary 1 & 2 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parlor Rotary #1 */}
        <div className="bg-[#F8F9F6] p-3.5 rounded-lg border border-[#E2E5DF] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-[#1E3A2F]" />
              <span className="text-xs font-bold text-[#1F2421]">Parlor Rotary #1</span>
            </div>
            <span className="text-xs font-semibold text-[#006c48]">60-Stall Deck</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#717973]">Throughput:</span>
              <span className="font-bold text-[#1F2421]">184 cows / hour</span>
            </div>
            <div className="w-full bg-[#EAECE7] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#006c48] h-1.5 rounded-full" style={{ width: "82%" }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E5DF] text-xs">
            <div>
              <span className="text-[#717973] text-[11px] block">Avg Attach Time</span>
              <span className="font-bold text-[#1F2421]">4.2 min</span>
            </div>
            <div>
              <span className="text-[#717973] text-[11px] block">Detachment Faults</span>
              <span className="font-bold text-[#006c48] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006c48]" />
                0 detected
              </span>
            </div>
          </div>
        </div>

        {/* Parlor Rotary #2 */}
        <div className="bg-[#F8F9F6] p-3.5 rounded-lg border border-[#E2E5DF] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-[#1E3A2F]" />
              <span className="text-xs font-bold text-[#1F2421]">Parlor Rotary #2</span>
            </div>
            <span className="text-xs font-semibold text-[#006c48]">60-Stall Deck</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#717973]">Throughput:</span>
              <span className="font-bold text-[#1F2421]">172 cows / hour</span>
            </div>
            <div className="w-full bg-[#EAECE7] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#006c48] h-1.5 rounded-full" style={{ width: "76%" }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E5DF] text-xs">
            <div>
              <span className="text-[#717973] text-[11px] block">Avg Attach Time</span>
              <span className="font-bold text-[#1F2421]">4.6 min</span>
            </div>
            <div>
              <span className="text-[#717973] text-[11px] block">Detachment Faults</span>
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                1 warning (Stall 14)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
