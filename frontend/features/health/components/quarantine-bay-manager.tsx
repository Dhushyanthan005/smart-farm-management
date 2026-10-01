"use client";

import React from "react";
import { ShieldAlert, ArrowRightLeft, CheckCircle2, UserCheck } from "lucide-react";

interface QuarantineBay {
  bayNumber: string;
  isOccupied: boolean;
  cowTag?: string;
  cowName?: string;
  condition?: string;
  isolationDays?: number;
}

const QUARANTINE_BAYS: QuarantineBay[] = [
  {
    bayNumber: "Bay 01",
    isOccupied: true,
    cowTag: "#1042",
    cowName: "Bessie",
    condition: "Acute Clinical Mastitis (RR Quarter)",
    isolationDays: 3,
  },
  {
    bayNumber: "Bay 02",
    isOccupied: true,
    cowTag: "#1084",
    cowName: "Aurora B",
    condition: "Conductivity Spike +38% (Withhold Active)",
    isolationDays: 1,
  },
  {
    bayNumber: "Bay 03",
    isOccupied: false,
  },
  {
    bayNumber: "Bay 04",
    isOccupied: true,
    cowTag: "#3190",
    cowName: "Duchess",
    condition: "Severe Mastitis (Rx Ceftiofur Day 3)",
    isolationDays: 4,
  },
];

export function QuarantineBayManager() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-base font-bold text-[#1F2421] font-headline">
              Quarantine Isolation Stanchions
            </h3>
            <p className="text-xs text-[#717973]">Physical sick bays with bio-isolated milk diversion</p>
          </div>
        </div>
        <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
          3 of 4 Bays Occupied
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUARANTINE_BAYS.map((bay) => {
          return (
            <div
              key={bay.bayNumber}
              className={`p-3.5 rounded-lg border flex flex-col justify-between space-y-3 ${
                bay.isOccupied
                  ? "bg-red-50/40 border-red-200"
                  : "bg-[#F8F9F6] border-[#E2E5DF]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1F2421]">{bay.bayNumber}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      bay.isOccupied
                        ? "bg-red-600 text-white"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {bay.isOccupied ? "Occupied" : "Available"}
                  </span>
                </div>

                {bay.isOccupied ? (
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="font-mono font-bold text-[#1E3A2F]">
                      {bay.cowTag} - {bay.cowName}
                    </div>
                    <div className="text-[11px] text-[#717973]">{bay.condition}</div>
                    <div className="text-[10px] text-red-700 font-semibold">
                      Day {bay.isolationDays} in isolation
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-[#717973] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Clean &amp; Sanitized
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`w-full py-1 text-xs font-semibold rounded border transition-colors shadow-sm ${
                  bay.isOccupied
                    ? "bg-white border-red-300 text-red-700 hover:bg-red-50"
                    : "bg-white border-[#E2E5DF] text-[#1E3A2F] hover:bg-[#F8F9F6]"
                }`}
              >
                {bay.isOccupied ? "Manage Protocol" : "Assign Animal"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
