"use client";

import React from "react";
import { AlertTriangle, Clock, Eye, CheckSquare } from "lucide-react";

interface UrgentHealthWatchlistProps {
  onIsolateCow?: (cowTag: string) => void;
  onReviewCmt?: (cowTag: string) => void;
  onConfirmPen?: (cowTag: string) => void;
}

export function UrgentHealthWatchlist({
  onIsolateCow,
  onReviewCmt,
  onConfirmPen,
}: UrgentHealthWatchlistProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#E2E5DF] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <h3 className="text-base font-bold text-[#1F2421] font-headline">
            Urgent Health &amp; Quarantine
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold">
          3 Action Items
        </span>
      </div>
      <p className="text-xs text-[#717973] -mt-2">
        Automated conductivity &amp; behavioral anomalies flagged in last shift
      </p>

      {/* Triage Watchlist Stack */}
      <div className="space-y-2.5">
        {/* Item 1: Mastitis Suspected (Cow #1084) */}
        <div className="p-3 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-50 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#1E3A2F] bg-white px-2 py-0.5 rounded border border-[#E2E5DF]">
                #1084
              </span>
              <span className="text-xs font-bold text-[#1F2421]">Pen 04 • Barn C</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
              Mastitis Suspected
            </span>
          </div>
          <p className="text-xs text-[#414844]">
            Conductivity spike (+38% Right Rear quarter). Automatic line diverter engaged to discard tank.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-red-600 font-semibold">Withhold Milk Active</span>
            <button
              type="button"
              onClick={() => onIsolateCow?.("#1084")}
              className="px-2.5 py-1 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm"
            >
              Isolate to Bay 02
            </button>
          </div>
        </div>

        {/* Item 2: High SCC Warning (Cow #0921) */}
        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#1E3A2F] bg-white px-2 py-0.5 rounded border border-[#E2E5DF]">
                #0921
              </span>
              <span className="text-xs font-bold text-[#1F2421]">String 02 • Pen 08</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D]">
              High SCC: 420k
            </span>
          </div>
          <p className="text-xs text-[#414844]">
            Yield dropped 4.2L vs 3-day baseline. CMT (California Mastitis Test) paddle kit dispatched.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#717973] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Flagged 06:22 AM
            </span>
            <button
              type="button"
              onClick={() => onReviewCmt?.("#0921")}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E2E5DF] hover:bg-[#F8F9F6] text-[#1F2421] rounded shadow-sm"
            >
              Review CMT Paddle
            </button>
          </div>
        </div>

        {/* Item 3: Calving Window Alert (Cow #1204) */}
        <div className="p-3 rounded-lg border border-[#E2E5DF] bg-[#F8F9F6] hover:bg-[#F4F6F2] transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#1E3A2F] bg-white px-2 py-0.5 rounded border border-[#E2E5DF]">
                #1204
              </span>
              <span className="text-xs font-bold text-[#1F2421]">Maternity Barn A</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E7F7ED] text-[#00734d] border border-[#006c48]/30">
              Calving Window
            </span>
          </div>
          <p className="text-xs text-[#414844]">
            Gestation Day 281. Accelerometer reports restlessness &amp; low rumination over 3h.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#006c48] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Monitor Camera #04
            </span>
            <button
              type="button"
              onClick={() => onConfirmPen?.("#1204")}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E2E5DF] hover:bg-[#F8F9F6] text-[#1F2421] rounded shadow-sm"
            >
              Confirm Pen Ready
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
