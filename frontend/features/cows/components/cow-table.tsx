"use client";

import React, { useState } from "react";
import {
  Eye,
  HeartPulse,
  Droplets,
  Columns,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  HelpCircle,
  Dna,
  CheckCircle,
} from "lucide-react";
import { StitchCow } from "../types/stitch-cow";

interface CowTableProps {
  cows: StitchCow[];
  onViewProfile: (cow: StitchCow) => void;
  onAddHealthNote?: (cow: StitchCow) => void;
  onLogMilk?: (cow: StitchCow) => void;
  onBreedCow?: (cow: StitchCow) => void;
}

export function CowTable({
  cows,
  onViewProfile,
  onAddHealthNote,
  onLogMilk,
  onBreedCow,
}: CowTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(["cow-1042", "cow-1043", "cow-1044"]);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const toggleSelectAll = () => {
    if (selectedIds.length === cows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cows.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-white border border-[#E2E5DF] rounded-lg shadow-sm flex flex-col overflow-hidden">
      {/* Table Density & Column Configuration Bar */}
      <div className="px-4 py-2 bg-[#F4F6F2] border-b border-[#E2E5DF] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#717973]">
          <span>
            Showing <strong className="text-[#1F2421]">1 - {cows.length}</strong> of 480 animals
          </span>
          <span className="h-3 w-px bg-[#E2E5DF]" />
          <span>{selectedIds.length} Selected</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Density Selector */}
          <div className="flex items-center gap-1 text-xs text-[#717973]">
            <span>Row Density:</span>
            <button
              type="button"
              onClick={() => setDensity("compact")}
              className={`px-1.5 py-0.5 rounded border text-xs font-semibold ${
                density === "compact"
                  ? "bg-white border-[#E2E5DF] text-[#1E3A2F]"
                  : "hover:bg-white text-[#717973]"
              }`}
            >
              Compact
            </button>
            <button
              type="button"
              onClick={() => setDensity("comfortable")}
              className={`px-1.5 py-0.5 rounded border text-xs font-semibold ${
                density === "comfortable"
                  ? "bg-white border-[#E2E5DF] text-[#1E3A2F]"
                  : "hover:bg-white text-[#717973]"
              }`}
            >
              Comfortable
            </button>
          </div>

          <span className="h-3 w-px bg-[#E2E5DF]" />

          {/* Custom Columns */}
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-[#717973] hover:text-[#1F2421]"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Customize Columns</span>
          </button>
        </div>
      </div>

      {/* Data Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F6F2] border-b border-[#E2E5DF] text-xs font-semibold text-[#717973] uppercase tracking-wider h-9">
              <th className="w-10 px-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === cows.length && cows.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[#E2E5DF] text-[#1E3A2F] focus:ring-[#1E3A2F] w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-3 py-2">RFID Tag &amp; Cow Name</th>
              <th className="px-3 py-2">Breed</th>
              <th className="px-3 py-2">Age / Parity</th>
              <th className="px-3 py-2">Days in Milk</th>
              <th className="px-3 py-2">Today's Yield</th>
              <th className="px-3 py-2">7-Day Avg</th>
              <th className="px-3 py-2">Somatic Cell (SCC)</th>
              <th className="px-3 py-2">Repro Status</th>
              <th className="px-3 py-2">Current Pen</th>
              <th className="px-3 py-2 text-right">Quick Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E5DF] text-xs text-[#1F2421]">
            {cows.map((cow) => {
              const isSelected = selectedIds.includes(cow.id);
              const paddingClass = density === "compact" ? "py-2" : "py-3.5";

              // Row background styling based on health
              let rowBg = "hover:bg-[#F8F9F6] transition-colors";
              if (cow.healthStatus === "Quarantined") {
                rowBg = "bg-red-50/30 hover:bg-red-50/60 transition-colors";
              } else if (cow.isWithheld) {
                rowBg = "bg-amber-50/30 hover:bg-amber-50/60 transition-colors";
              }

              return (
                <tr key={cow.id} className={rowBg}>
                  <td className={`${paddingClass} px-3 text-center`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(cow.id)}
                      className="rounded border-[#E2E5DF] text-[#1E3A2F] focus:ring-[#1E3A2F] w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* RFID Tag & Cow Name */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap`}>
                    <div className="flex items-center gap-2">
                      {cow.statusDot === "red" && (
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      )}
                      {cow.statusDot === "green" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                      {cow.statusDot === "amber" && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                      {cow.statusDot === "gray" && (
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                      )}
                      <div>
                        <div className="font-mono font-bold text-[#1E3A2F] flex items-center gap-1.5">
                          <span>{cow.tagNumber}</span>
                          <span className="text-[#717973] font-normal">{cow.name}</span>
                        </div>
                        <div className="text-[11px] text-[#717973]">RFID: {cow.rfid}</div>
                      </div>
                    </div>
                  </td>

                  {/* Breed */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap font-medium text-[#1F2421]`}>
                    {cow.breed}
                  </td>

                  {/* Age / Parity */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap`}>
                    <span className="text-[#1F2421]">{cow.age}</span>
                    <span className="text-[#717973] text-[11px] block">Lactation {cow.parity}</span>
                  </td>

                  {/* Days in Milk */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap font-mono`}>
                    {cow.dim !== null ? (
                      <>
                        <span className="font-semibold text-[#1E3A2F]">{cow.dim}d</span>
                        <span className="text-[11px] text-[#717973] block">{cow.dimStage}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-[#717973]">Dry Period</span>
                        <span className="text-[11px] text-[#717973] block">{cow.dimStage}</span>
                      </>
                    )}
                  </td>

                  {/* Today's Yield */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap font-mono font-bold`}>
                    {cow.isWithheld ? (
                      <>
                        <span className="line-through text-[#717973]">{cow.todayYield} L</span>
                        <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider">
                          Withheld Milk
                        </span>
                      </>
                    ) : cow.todayYield !== null ? (
                      <>
                        <span
                          className={
                            cow.yieldDiff?.startsWith("-") && !cow.isWithheld
                              ? "text-red-700"
                              : "text-[#1F2421]"
                          }
                        >
                          {cow.todayYield} L
                        </span>
                        <span
                          className={`text-[11px] font-normal block ${
                            cow.yieldDiff?.startsWith("+")
                              ? "text-emerald-700"
                              : cow.yieldDiff?.startsWith("-")
                              ? "text-red-600"
                              : "text-[#717973]"
                          }`}
                        >
                          {cow.yieldDiff}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#717973]">--</span>
                    )}
                  </td>

                  {/* 7-Day Avg */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap font-mono`}>
                    {cow.sevenDayAvg !== null ? `${cow.sevenDayAvg} L` : "--"}
                  </td>

                  {/* Somatic Cell (SCC) */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap`}>
                    {cow.sccStatus === "danger" && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-800 border border-red-300 font-bold">
                        <AlertTriangle className="w-3 h-3 text-red-700" />
                        {cow.sccValue}
                      </span>
                    )}
                    {cow.sccStatus === "warning" && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-800 border border-amber-300 font-medium">
                        {cow.sccValue}
                      </span>
                    )}
                    {cow.sccStatus === "resolving" && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200">
                        {cow.sccValue}
                      </span>
                    )}
                    {cow.sccStatus === "normal" && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {cow.sccValue}
                      </span>
                    )}
                  </td>

                  {/* Repro Status */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap`}>
                    {cow.estrusAlert ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-bold animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        {cow.reproStatus}
                      </span>
                    ) : cow.reproVariant === "success" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                        {cow.reproStatus}
                      </span>
                    ) : cow.reproVariant === "warning" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <HelpCircle className="w-3 h-3" />
                        {cow.reproStatus}
                      </span>
                    ) : cow.reproVariant === "info" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                        <Dna className="w-3 h-3" />
                        {cow.reproStatus}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {cow.reproStatus}
                      </span>
                    )}
                  </td>

                  {/* Current Pen */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap font-medium`}>
                    {cow.healthStatus === "Quarantined" ? (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 text-xs font-semibold">
                        {cow.currentPen}
                      </span>
                    ) : (
                      <span>{cow.currentPen}</span>
                    )}
                  </td>

                  {/* Quick Actions */}
                  <td className={`${paddingClass} px-3 whitespace-nowrap text-right`}>
                    <div className="flex items-center justify-end gap-1">
                      {cow.estrusAlert && (
                        <button
                          type="button"
                          onClick={() => onBreedCow?.(cow)}
                          className="px-2 py-0.5 rounded bg-[#1E3A2F] text-white text-xs font-semibold flex items-center gap-1 shadow-sm mr-1 hover:bg-[#1b4332]"
                          title="Log Insemination"
                        >
                          <Dna className="w-3 h-3" /> Breed Now
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewProfile(cow)}
                        className="p-1 rounded text-[#717973] hover:text-[#1E3A2F] hover:bg-[#F4F6F2]"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onAddHealthNote?.(cow)}
                        className={`p-1 rounded ${
                          cow.healthStatus === "Quarantined"
                            ? "text-red-700 hover:bg-red-100"
                            : "text-[#717973] hover:text-[#1E3A2F] hover:bg-[#F4F6F2]"
                        }`}
                        title="Add Health Note"
                      >
                        <HeartPulse className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        disabled={cow.dim === null}
                        onClick={() => onLogMilk?.(cow)}
                        className={`p-1 rounded ${
                          cow.dim === null
                            ? "text-[#717973]/40 cursor-not-allowed"
                            : "text-[#717973] hover:text-[#006c48] hover:bg-[#F4F6F2]"
                        }`}
                        title="Log Milk"
                      >
                        <Droplets className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      <div className="px-4 py-2.5 bg-[#F4F6F2] border-t border-[#E2E5DF] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#717973]">
          <span>Rows per page:</span>
          <select className="h-7 text-xs bg-white border border-[#E2E5DF] rounded px-2 focus:outline-none focus:border-[#1E3A2F]">
            <option>25</option>
            <option>50</option>
            <option>100</option>
            <option>250</option>
          </select>
          <span className="ml-2">1–8 of 480 animals</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#717973] disabled:opacity-40"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#717973] disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded bg-[#1E3A2F] text-white font-bold text-xs"
          >
            1
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#1F2421] hover:bg-[#F4F6F2] text-xs"
          >
            2
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#1F2421] hover:bg-[#F4F6F2] text-xs"
          >
            3
          </button>
          <span className="px-1 text-[#717973] text-xs">...</span>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#1F2421] hover:bg-[#F4F6F2] text-xs"
          >
            20
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#1F2421] hover:bg-[#F4F6F2]"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#1F2421] hover:bg-[#F4F6F2]"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
