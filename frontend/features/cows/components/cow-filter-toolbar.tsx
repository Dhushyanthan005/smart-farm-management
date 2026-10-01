"use client";

import React from "react";
import { Search, Clock, ShieldCheck, Building2, Repeat, ChevronDown } from "lucide-react";
import { LactationStage, CowHealthStatus } from "../types/stitch-cow";

interface CowFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStage: string;
  onStageChange: (stage: string) => void;
  selectedHealth: string;
  onHealthChange: (health: string) => void;
  selectedBarn: string;
  onBarnChange: (barn: string) => void;
  selectedParity: string;
  onParityChange: (parity: string) => void;
  onReset: () => void;
}

export function CowFilterToolbar({
  searchQuery,
  onSearchChange,
  selectedStage,
  onStageChange,
  selectedHealth,
  onHealthChange,
  selectedBarn,
  onBarnChange,
  selectedParity,
  onParityChange,
  onReset,
}: CowFilterToolbarProps) {
  const stages = ["All", "Early", "Peak", "Mid", "Late", "Dry"];
  const healthOptions = [
    { label: "All", value: "All" },
    { label: "Healthy", value: "Healthy", dot: "bg-emerald-600" },
    { label: "Observation", value: "Observation", dot: "bg-amber-500" },
    { label: "Quarantined", value: "Quarantined", dot: "bg-rose-600" },
  ];

  return (
    <div className="bg-white border-b border-[#E2E5DF] px-6 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      {/* Search Bar with RFID/Collar/Name targeting */}
      <div className="relative w-full xl:w-96">
        <Search className="w-4 h-4 text-[#717973] absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by RFID Tag, Collar ID, or Cow Name..."
          className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F] placeholder:text-[#717973]"
        />
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center flex-wrap gap-2 text-xs overflow-x-auto pb-1 xl:pb-0">
        <span className="text-[#717973] font-semibold mr-1 text-[11px] uppercase tracking-wider">
          Filters:
        </span>

        {/* Lactation Stage Filter */}
        <div className="inline-flex rounded border border-[#E2E5DF] overflow-hidden bg-white shadow-sm">
          <span className="px-2 py-1 bg-[#F4F6F2] text-[#414844] font-medium border-r border-[#E2E5DF] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Stage:
          </span>
          {stages.map((stage) => {
            const isActive = selectedStage === stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => onStageChange(stage)}
                className={`px-2 py-1 transition-colors ${
                  isActive
                    ? "bg-[#1E3A2F] text-white font-semibold"
                    : "hover:bg-[#F4F6F2] text-[#1F2421]"
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>

        {/* Health Status Filter */}
        <div className="inline-flex rounded border border-[#E2E5DF] overflow-hidden bg-white shadow-sm">
          <span className="px-2 py-1 bg-[#F4F6F2] text-[#414844] font-medium border-r border-[#E2E5DF] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Health:
          </span>
          {healthOptions.map((opt) => {
            const isActive = selectedHealth === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onHealthChange(opt.value)}
                className={`px-2 py-1 flex items-center gap-1 transition-colors ${
                  isActive
                    ? "bg-[#1E3A2F] text-white font-semibold"
                    : "hover:bg-[#F4F6F2] text-[#1F2421]"
                }`}
              >
                {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Barn Selector */}
        <div className="relative inline-block">
          <select
            value={selectedBarn}
            onChange={(e) => onBarnChange(e.target.value)}
            className="h-7 pl-2 pr-7 bg-white border border-[#E2E5DF] hover:border-[#717973] text-[#1F2421] rounded text-xs appearance-none focus:outline-none focus:border-[#1E3A2F] cursor-pointer"
          >
            <option value="All">Barn: All Locations</option>
            <option value="Barn A">Barn A</option>
            <option value="Barn B">Barn B</option>
            <option value="Maternity">Maternity Barn</option>
            <option value="Pasture 2">Pasture 2</option>
            <option value="Quarantine">Quarantine Bay</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#717973] absolute right-2 top-2 pointer-events-none" />
        </div>

        {/* Parity Selector */}
        <div className="relative inline-block">
          <select
            value={selectedParity}
            onChange={(e) => onParityChange(e.target.value)}
            className="h-7 pl-2 pr-7 bg-white border border-[#E2E5DF] hover:border-[#717973] text-[#1F2421] rounded text-xs appearance-none focus:outline-none focus:border-[#1E3A2F] cursor-pointer"
          >
            <option value="All">Parity: Any</option>
            <option value="1">Lactation 1</option>
            <option value="2">Lactation 2</option>
            <option value="3">Lactation 3</option>
            <option value="4+">Lactation 4+</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#717973] absolute right-2 top-2 pointer-events-none" />
        </div>

        {/* Clear Filters */}
        <button
          type="button"
          onClick={onReset}
          className="text-[#717973] hover:text-red-600 ml-1 text-xs underline font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
