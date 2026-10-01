"use client";

import React from "react";
import { Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

interface WithdrawalCase {
  tag: string;
  name: string;
  pen: string;
  drug: string;
  dosage: string;
  administeredAt: string;
  hoursRemaining: number;
  clearTime: string;
  isDelvotestPass: boolean;
}

const WITHDRAWAL_CASES: WithdrawalCase[] = [
  {
    tag: "#1045",
    name: "Buttercup",
    pen: "Barn B • Pen 04",
    drug: "Spectramast LC (Ceftiofur)",
    dosage: "10ml Intramammary",
    administeredAt: "Oct 22, 08:00 AM",
    hoursRemaining: 48,
    clearTime: "Oct 26, 08:00 AM",
    isDelvotestPass: false,
  },
  {
    tag: "#3190",
    name: "Duchess",
    pen: "Quarantine Q-2",
    drug: "Excenel RTU (Ceftiofur HCl)",
    dosage: "20ml Intramuscular",
    administeredAt: "Oct 23, 06:00 AM",
    hoursRemaining: 72,
    clearTime: "Oct 27, 06:00 AM",
    isDelvotestPass: false,
  },
  {
    tag: "#0841",
    name: "Molly",
    pen: "Barn A • Fresh",
    drug: "Penicillin G Procaine",
    dosage: "15ml SubQ",
    administeredAt: "Oct 20, 14:00 PM",
    hoursRemaining: 6,
    clearTime: "Today @ 20:00 PM",
    isDelvotestPass: true,
  },
];

export function AntibioticWithdrawalTracker() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
        <div>
          <h3 className="text-base font-bold text-[#1F2421] font-headline">
            Active Antibiotic Withdrawal Tracker
          </h3>
          <p className="text-xs text-[#717973]">
            Mandatory milk diversion protocols with automated line lockouts
          </p>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
          3 Monitored Animals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {WITHDRAWAL_CASES.map((item) => {
          const isUrgent = item.hoursRemaining > 24;
          return (
            <div
              key={item.tag}
              className={`p-3.5 rounded-lg border flex flex-col justify-between space-y-3 ${
                isUrgent
                  ? "bg-amber-50/40 border-amber-200"
                  : "bg-emerald-50/40 border-emerald-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-[#1E3A2F] bg-white px-2 py-0.5 rounded border border-[#E2E5DF]">
                      {item.tag}
                    </span>
                    <span className="text-xs font-bold text-[#1F2421]">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#717973]">{item.pen}</span>
                </div>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="text-[#1F2421]">
                    <strong className="text-[#717973]">Rx:</strong> {item.drug}
                  </div>
                  <div className="text-[11px] text-[#717973]">
                    Dosage: {item.dosage}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E5DF] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#717973] block">
                    Clearance Time
                  </span>
                  <span className="font-mono font-bold text-xs text-[#1F2421]">
                    {item.clearTime}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                    isUrgent
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {item.hoursRemaining}h left
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
