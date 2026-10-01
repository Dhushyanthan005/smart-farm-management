"use client";

import React from "react";
import { Truck, CheckCircle2, ShieldCheck, FileText, Lock, Building2 } from "lucide-react";
import { TankerDispatch } from "../types/milk-log";

interface TankerDispatchCardProps {
  dispatch: TankerDispatch;
  onGenerateBol?: () => void;
}

export function TankerDispatchCard({ dispatch, onGenerateBol }: TankerDispatchCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E7EEFF] flex items-center justify-center text-[#1E3A2F]">
            <Truck className="w-4 h-4 text-[#1E3A2F]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E3A2F] font-headline">Milk Tanker Dispatch</h3>
            <p className="text-xs text-[#717973]">Outbound Logistics &amp; Quality Release</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
          {dispatch.route}
        </span>
      </div>

      {/* Pickup Schedule Box */}
      <div className="p-3.5 rounded-lg bg-[#F8F9F6] border border-[#E2E5DF] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717973]">
            Upcoming Pickup
          </span>
          <span className="font-mono text-[#1E3A2F] font-bold text-xs">{dispatch.pickupTime}</span>
        </div>
        <div className="flex items-center gap-2 text-[#1F2421]">
          <Building2 className="w-4 h-4 text-[#006c48]" />
          <span className="text-xs font-bold">{dispatch.cooperative}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#717973] pt-1">
          <span>Driver: {dispatch.driver}</span>
          <span className="font-mono">{dispatch.tankerNumber}</span>
        </div>
      </div>

      {/* Tank Sample Test Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717973]">
            Certified Lab Pre-Check
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#86EFAC]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Antibiotic Test PASS
          </span>
        </div>

        {/* Metrics Matrix */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="p-2.5 rounded border border-[#E2E5DF] bg-[#F8F9F6] text-center">
            <div className="text-[10px] font-semibold text-[#717973] uppercase">Butterfat</div>
            <div className="font-mono font-bold text-sm text-[#1E3A2F] mt-0.5">
              {dispatch.butterfat}%
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">+0.12% Prem</div>
          </div>

          <div className="p-2.5 rounded border border-[#E2E5DF] bg-[#F8F9F6] text-center">
            <div className="text-[10px] font-semibold text-[#717973] uppercase">Protein</div>
            <div className="font-mono font-bold text-sm text-[#1E3A2F] mt-0.5">
              {dispatch.protein}%
            </div>
            <div className="text-[10px] text-[#717973] font-medium">Std Grade A</div>
          </div>

          <div className="p-2.5 rounded border border-[#E2E5DF] bg-[#F8F9F6] text-center">
            <div className="text-[10px] font-semibold text-[#717973] uppercase">Freeze Point</div>
            <div className="font-mono font-bold text-sm text-[#1E3A2F] mt-0.5">
              {dispatch.freezePoint}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">0.0% Added H2O</div>
          </div>
        </div>

        {/* Additional Regulatory Parameters */}
        <div className="mt-3 p-2.5 rounded border border-[#E2E5DF] bg-white space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[#1F2421]">
            <span className="text-[#717973]">Somatic Cell Count (Bulk):</span>
            <span className="font-mono font-semibold text-[#1E3A2F]">{dispatch.scc}</span>
          </div>
          <div className="flex justify-between items-center text-[#1F2421]">
            <span className="text-[#717973]">Standard Plate Count (SPC):</span>
            <span className="font-mono font-semibold text-[#1E3A2F]">{dispatch.spc}</span>
          </div>
          <div className="flex justify-between items-center text-[#1F2421]">
            <span className="text-[#717973]">Rapid Delvotest Beta-Lactam:</span>
            <span className="font-mono font-semibold text-emerald-700">{dispatch.betaLactam}</span>
          </div>
        </div>
      </div>

      {/* Allocation & Bill of Lading Action Button */}
      <div className="pt-3 border-t border-[#E2E5DF] space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-[#717973]">Release Target Silo:</span>
          <span className="font-bold text-[#1E3A2F] font-mono">
            {dispatch.assignedTank} ({dispatch.assignedVolume.toLocaleString()} L Assigned)
          </span>
        </div>

        <button
          type="button"
          onClick={onGenerateBol}
          className="w-full h-10 bg-[#1E3A2F] hover:bg-[#1b4332] active:bg-[#143326] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Milk Bill of Lading / Dispatch Slip</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#717973]">
          <Lock className="w-3.5 h-3.5" />
          <span>Cryptographic Seal &amp; USDA Grade A Certified Manifest</span>
        </div>
      </div>
    </div>
  );
}
