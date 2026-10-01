"use client";

import React from "react";
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

export function HealthKpiSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Quarantine */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
              Quarantine Isolation
            </span>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
              2 Animals
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">2 Head</div>
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> Bay 02 &amp; Q-2 Occupied
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] text-[11px] text-[#717973]">
          Automated line diverter active
        </div>
      </div>

      {/* 2. Antibiotic Withdrawal */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
              Withhold Milk Watch
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
              Rx Active
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">10 Animals</div>
          <p className="text-xs text-amber-700 mt-1 font-semibold">245.5 L Diverted to Waste</p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] text-[11px] text-[#717973]">
          Zero tolerance beta-lactam rule
        </div>
      </div>

      {/* 3. Pending Vet Rounds */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
              Vet Protocols Due
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
              Today @ 14:00
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">3 Cases</div>
          <p className="text-xs text-blue-700 mt-1 font-medium">Dr. Evans, DVM On-Call</p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] text-[11px] text-[#717973]">
          Post-calving check &amp; Ultrasounds
        </div>
      </div>

      {/* 4. Udder Health SCC Index */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
              Herd Udder Health
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Optimal
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1E3A2F] font-headline mt-1">118k SCC</div>
          <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Grade A Premium Standard
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] text-[11px] text-[#717973]">
          Tank bulk inline verified
        </div>
      </div>
    </div>
  );
}
