"use client";

import React from "react";
import { Flame, CalendarClock, Heart, BellRing, AlertOctagon, Sparkles } from "lucide-react";
import { useBreedingSummary } from "../hooks/use-breeding";

interface BreedingKpiSummaryProps {
  onRecordHeat?: () => void;
  onRecordBreeding?: () => void;
  onConfirmPregnancy?: () => void;
  onRecordCalving?: () => void;
}

export function BreedingKpiSummary({
  onRecordHeat,
  onRecordBreeding,
  onConfirmPregnancy,
  onRecordCalving,
}: BreedingKpiSummaryProps) {
  const { data: response, isLoading } = useBreedingSummary();
  const summary = response?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E2E5DF] h-28 flex flex-col justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const cowsInHeat = summary?.cowsInHeat ?? 0;
  const breedingDue = summary?.breedingDue ?? 0;
  const pregnantCows = summary?.pregnantCows ?? 0;
  const upcomingCalvings = summary?.upcomingCalvings ?? 0;
  const overdueCalvings = summary?.overduePregnancies ?? 0;
  const recentCalvings = summary?.recentCalvings ?? 0;
  const conceptionRate = summary?.conceptionRate ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. In Heat */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-xs flex flex-col justify-between transition-all hover:border-[#1E3A2F]/30">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              In Heat (Active)
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                cowsInHeat > 0 ? "bg-amber-100 text-amber-800" : "bg-[#F4F6F2] text-[#717973]"
              }`}
            >
              Last 48h
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">
            {cowsInHeat} Head
          </div>
          <p className="text-[11px] text-[#717973] mt-1">
            {breedingDue > 0 ? `${breedingDue} due for insemination today` : "Optimal insemination window monitored"}
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] flex items-center justify-between">
          <span className="text-[10px] text-[#717973]">Ready for AI</span>
          {onRecordHeat && (
            <button
              onClick={onRecordHeat}
              className="text-[11px] font-semibold text-[#1E3A2F] hover:underline"
            >
              + Log Heat
            </button>
          )}
        </div>
      </div>

      {/* 2. Confirmed Pregnant */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-xs flex flex-col justify-between transition-all hover:border-[#1E3A2F]/30">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              Confirmed Pregnant
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-800">
              {conceptionRate > 0 ? `${conceptionRate}% CR` : "Active"}
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">
            {pregnantCows} Head
          </div>
          <p className="text-[11px] text-[#717973] mt-1">
            {conceptionRate > 0 ? `${conceptionRate}% herd conception rate` : "Reproductive status tracking"}
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] flex items-center justify-between">
          <span className="text-[10px] text-[#717973]">Gestation monitored</span>
          {onConfirmPregnancy && (
            <button
              onClick={onConfirmPregnancy}
              className="text-[11px] font-semibold text-[#1E3A2F] hover:underline"
            >
              + Confirm
            </button>
          )}
        </div>
      </div>

      {/* 3. Upcoming Calvings */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-xs flex flex-col justify-between transition-all hover:border-[#1E3A2F]/30">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-blue-500" />
              Upcoming Calvings
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Next 30 Days
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">
            {upcomingCalvings} Due
          </div>
          <p className="text-[11px] text-[#717973] mt-1">
            Maternity pen preparation required
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] flex items-center justify-between">
          <span className="text-[10px] text-[#717973]">Transition protocol</span>
          {onRecordCalving && (
            <button
              onClick={onRecordCalving}
              className="text-[11px] font-semibold text-[#1E3A2F] hover:underline"
            >
              + Calving
            </button>
          )}
        </div>
      </div>

      {/* 4. Overdue Calvings */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-xs flex flex-col justify-between transition-all hover:border-[#1E3A2F]/30">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
              Overdue Calvings
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                overdueCalvings > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {overdueCalvings > 0 ? "Attention" : "All Clear"}
            </span>
          </div>
          <div
            className={`text-2xl font-bold font-headline mt-1 ${
              overdueCalvings > 0 ? "text-red-700" : "text-[#1F2421]"
            }`}
          >
            {overdueCalvings} Head
          </div>
          <p className="text-[11px] text-[#717973] mt-1">
            {overdueCalvings > 0 ? "Past expected 283 days gestation" : "Zero pregnancies past due date"}
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] flex items-center justify-between">
          <span className="text-[10px] text-[#717973]">Vet examination</span>
          <span className="text-[10px] font-medium text-[#717973]">283-day baseline</span>
        </div>
      </div>

      {/* 5. Recent Calvings */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E5DF] shadow-xs flex flex-col justify-between transition-all hover:border-[#1E3A2F]/30">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Fresh / Calved
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              30 Days
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1F2421] font-headline mt-1">
            {recentCalvings} Calved
          </div>
          <p className="text-[11px] text-[#717973] mt-1">
            Fresh cows entering lactation cycle
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2E5DF] flex items-center justify-between">
          <span className="text-[10px] text-[#717973]">Parity updated</span>
          <span className="text-[10px] font-medium text-emerald-700">Fresh milk status</span>
        </div>
      </div>
    </div>
  );
}
