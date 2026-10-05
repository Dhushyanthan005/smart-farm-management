"use client";

import React from "react";
import { ChevronRight, Dna, MoveRight, Download, PlusCircle } from "lucide-react";
import { Can } from "@/components/auth/can";
import { CowStats } from "@/types/cow";

interface CowStatsBannerProps {
  stats?: CowStats;
  onBulkInsemination?: () => void;
  onMovePen?: () => void;
  onExportCsv?: () => void;
  onRegisterCow?: () => void;
}

export function CowStatsBanner({
  stats,
  onBulkInsemination,
  onMovePen,
  onExportCsv,
  onRegisterCow,
}: CowStatsBannerProps) {
  const totalHead = stats ? stats.totalHead : 0;
  const inMilk = stats ? stats.inMilk : 0;
  const dry = stats ? stats.dry : 0;
  const heifers = stats ? stats.heifers : 0;
  const quarantine = stats ? stats.quarantine : 0;

  return (
    <div className="bg-white border-b border-[#E2E5DF] px-6 py-3 flex-shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          {/* Breadcrumb Pathing */}
          <div className="flex items-center gap-1.5 text-xs text-[#717973] mb-1 font-medium">
            <span>Herd Management</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#717973]" />
            <span className="font-bold text-[#1E3A2F]">Cow Directory</span>
          </div>

          {/* Herd Aggregate Metric Counters */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-xl font-bold text-[#1E3A2F] mr-1 font-headline">
              {totalHead} Head
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              {inMilk} In Milk
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              {dry} Dry
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {heifers} Heifers
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              {quarantine > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1 animate-ping" />
              )}
              {quarantine} Quarantine
            </span>
          </div>
        </div>

        {/* High-Repetition Batch Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onBulkInsemination}
            className="h-8 px-2.5 bg-white border border-[#E2E5DF] hover:border-[#717973] text-[#1F2421] rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 hover:bg-[#F8F9F6] active:scale-95"
          >
            <Dna className="w-3.5 h-3.5 text-[#006c48]" />
            <span>Bulk Insemination Log</span>
          </button>

          <button
            type="button"
            onClick={onMovePen}
            className="h-8 px-2.5 bg-white border border-[#E2E5DF] hover:border-[#717973] text-[#1F2421] rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 hover:bg-[#F8F9F6] active:scale-95"
          >
            <MoveRight className="w-3.5 h-3.5 text-[#006c48]" />
            <span>Move to Pen/Barn</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="h-8 px-2.5 bg-white border border-[#E2E5DF] hover:border-[#717973] text-[#1F2421] rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 hover:bg-[#F8F9F6] active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#717973]" />
            <span>Export Registry CSV</span>
          </button>

          <Can permission={["COW_CREATE", "COW_WRITE"]}>
            <button
              type="button"
              onClick={onRegisterCow}
              className="h-8 px-3 bg-[#1E3A2F] text-white hover:bg-[#1b4332] rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Register New Cow</span>
            </button>
          </Can>
        </div>
      </div>
    </div>
  );
}
