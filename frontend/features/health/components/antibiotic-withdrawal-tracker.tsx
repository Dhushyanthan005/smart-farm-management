"use client";

import React from "react";
import { Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useWithdrawals } from "../hooks/use-health";

export function AntibioticWithdrawalTracker() {
  const { data: response, isLoading } = useWithdrawals();
  const withdrawalCases = response?.data || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-5 space-y-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg border border-[#E2E5DF]" />
          ))}
        </div>
      </div>
    );
  }

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
        <span
          className={`px-2 py-0.5 rounded border text-xs font-semibold ${
            withdrawalCases.length > 0
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {withdrawalCases.length} {withdrawalCases.length === 1 ? "Monitored Animal" : "Monitored Animals"}
        </span>
      </div>

      {withdrawalCases.length === 0 ? (
        <div className="py-8 text-center bg-[#F8F9F6] rounded-lg border border-dashed border-[#E2E5DF]">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1F2421]">No Active Antibiotic Withdrawals</p>
          <p className="text-xs text-[#717973] mt-0.5">
            All herd members are currently eligible for bulk milk collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {withdrawalCases.map((item) => {
            const isUrgent = item.daysRemaining > 1 || item.hoursRemaining > 24;
            const remainingDisplay =
              item.daysRemaining > 0
                ? `${item.daysRemaining}d remaining`
                : `${item.hoursRemaining}h remaining`;

            return (
              <div
                key={item.treatmentId}
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
                        {item.cowTagNumber}
                      </span>
                      {item.cowName && (
                        <span className="text-xs font-bold text-[#1F2421]">{item.cowName}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                      MILK WITHHELD
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="text-[#1F2421]">
                      <strong className="text-[#717973]">Rx:</strong> {item.medication}
                    </div>
                    <div className="text-[11px] text-[#717973]">
                      Period: {item.withdrawalDays} days withdrawal
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E5DF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#717973] block">
                      Clearance Date
                    </span>
                    <span className="font-mono font-bold text-xs text-[#1F2421]">
                      {item.withdrawalEndDate}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      isUrgent
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{remainingDisplay}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
