"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface CowTelemetryFooterProps {
  onReviewEstrus?: () => void;
}

export function CowTelemetryFooter({ onReviewEstrus }: CowTelemetryFooterProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-shrink-0">
      {/* 1. Tank Bulk SCC Average */}
      <div className="bg-white border border-[#E2E5DF] rounded-lg p-3 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
            Tank Bulk SCC Average
          </div>
          <div className="text-base font-bold text-[#1E3A2F] mt-0.5">
            118,400 <span className="text-xs font-normal text-[#717973]">cells/mL</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
          Grade A Premium
        </span>
      </div>

      {/* 2. Estrus Spike Alerts */}
      <div className="bg-white border border-[#E2E5DF] rounded-lg p-3 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
            Estrus Spike Alerts
          </div>
          <div className="text-base font-bold text-amber-700 mt-0.5">6 Cows Active</div>
        </div>
        <button
          type="button"
          onClick={onReviewEstrus}
          className="text-xs text-[#1E3A2F] underline font-semibold hover:text-[#006c48]"
        >
          Review Protocol →
        </button>
      </div>

      {/* 3. Withheld Volume (24h) */}
      <div className="bg-white border border-[#E2E5DF] rounded-lg p-3 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
            Withheld Volume (24h)
          </div>
          <div className="text-base font-bold text-red-700 mt-0.5">245.5 Liters</div>
        </div>
        <span className="px-2 py-0.5 rounded text-xs bg-red-50 text-red-800 border border-red-200 font-semibold">
          10 Animals
        </span>
      </div>

      {/* 4. Parlor Efficiency Rate */}
      <div className="bg-white border border-[#E2E5DF] rounded-lg p-3 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
            Parlor Efficiency Rate
          </div>
          <div className="text-base font-bold text-[#1E3A2F] mt-0.5">
            98.4% <span className="text-xs font-normal text-emerald-700 font-semibold">+0.6%</span>
          </div>
        </div>
        <CheckCircle2 className="w-5 h-5 text-[#006c48]" />
      </div>
    </div>
  );
}
