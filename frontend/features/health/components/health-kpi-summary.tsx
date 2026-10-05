"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, Stethoscope } from "lucide-react";
import { useHealthSummary } from "../hooks/use-health";

export function HealthKpiSummary() {
  const { data: response, isLoading, isError } = useHealthSummary();
  const summary = response?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E2E5DF] h-32 flex flex-col justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const quarantinedCount = summary?.quarantinedCount ?? summary?.occupiedBaysCount ?? 0;
  const activeWithdrawals = summary?.activeWithdrawalsCount ?? 0;
  const activeTreatments = summary?.activeTreatmentsCount ?? summary?.underTreatmentCount ?? 0;
  const healthyCount = summary?.healthyCount ?? 0;
  const totalCows = summary?.totalCows ?? 0;
  const healthScore = summary?.herdHealthScore ?? (totalCows > 0 ? Math.round((healthyCount / totalCows) * 100) : 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Quarantine */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
              Quarantine Isolation
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                quarantinedCount > 0
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {quarantinedCount} {quarantinedCount === 1 ? "Animal" : "Animals"}
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">
            {quarantinedCount} Head
          </div>
          <p
            className={`text-xs mt-1 flex items-center gap-1 font-semibold ${
              quarantinedCount > 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {quarantinedCount > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> Bio-isolation protocols active
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> All isolation bays clear
              </>
            )}
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
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                activeWithdrawals > 0
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {activeWithdrawals > 0 ? "Rx Active" : "Clear"}
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">
            {activeWithdrawals} {activeWithdrawals === 1 ? "Animal" : "Animals"}
          </div>
          <p
            className={`text-xs mt-1 font-semibold ${
              activeWithdrawals > 0 ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            {activeWithdrawals > 0
              ? `${activeWithdrawals} milking lockout active`
              : "0 active antibiotic locks"}
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] text-[11px] text-[#717973]">
          Zero tolerance beta-lactam rule
        </div>
      </div>

      {/* 3. Active Clinical Treatments */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
              Clinical Treatments
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
              {activeTreatments} Active
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">
            {activeTreatments} Cases
          </div>
          <p className="text-xs text-blue-700 mt-1 font-medium flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5" /> Veterinary oversight required
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] text-[11px] text-[#717973]">
          Scheduled veterinary regimens
        </div>
      </div>

      {/* 4. Herd Health Status */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
              Herd Health Score
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                healthScore >= 90
                  ? "bg-emerald-100 text-emerald-800"
                  : healthScore >= 75
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {healthScore >= 90 ? "Optimal" : healthScore >= 75 ? "Caution" : "Critical"}
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1E3A2F] font-headline mt-1">
            {healthScore}% Healthy
          </div>
          <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {healthyCount} of {totalCows} Head Healthy
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] text-[11px] text-[#717973]">
          Grade A dairy quality baseline
        </div>
      </div>
    </div>
  );
}
