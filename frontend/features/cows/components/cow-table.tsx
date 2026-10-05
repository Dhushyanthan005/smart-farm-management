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
  Pencil,
  PlusCircle,
  Inbox,
} from "lucide-react";
import { StitchCow } from "../types/stitch-cow";
import { Can } from "@/components/auth/can";

interface CowTableProps {
  cows: StitchCow[];
  onViewProfile: (cow: StitchCow) => void;
  onEditCow?: (cow: StitchCow) => void;
  onAddHealthNote?: (cow: StitchCow) => void;
  onLogMilk?: (cow: StitchCow) => void;
  onBreedCow?: (cow: StitchCow) => void;
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRegisterCow?: () => void;
}

export function CowTable({
  cows,
  onViewProfile,
  onEditCow,
  onAddHealthNote,
  onLogMilk,
  onBreedCow,
  isLoading = false,
  totalCount = 0,
  currentPage = 0,
  pageSize = 20,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  onRegisterCow,
}: CowTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");

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

  const startRecord = totalCount === 0 ? 0 : currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <div className="bg-white border border-[#E2E5DF] rounded-lg shadow-sm flex flex-col overflow-hidden">
      {/* Table Density & Column Configuration Bar */}
      <div className="px-4 py-2 bg-[#F4F6F2] border-b border-[#E2E5DF] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#717973]">
          <span>
            Showing <strong className="text-[#1F2421]">{startRecord} - {endRecord}</strong> of {totalCount} animals
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

      {/* Main Table Matrix Canvas */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white border-b border-[#E2E5DF] text-[#717973] text-[11px] font-semibold tracking-wider uppercase">
              <th className="py-2.5 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={cows.length > 0 && selectedIds.length === cows.length}
                  onChange={toggleSelectAll}
                  className="rounded border-[#E2E5DF] text-[#1E3A2F] focus:ring-[#1E3A2F] cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3">Tag & Name</th>
              <th className="py-2.5 px-3">Breed & Age</th>
              <th className="py-2.5 px-3 text-center">Parity</th>
              <th className="py-2.5 px-3">Lactation Stage / DIM</th>
              <th className="py-2.5 px-3 text-right">Daily Yield (L)</th>
              <th className="py-2.5 px-3">SCC Status</th>
              <th className="py-2.5 px-3">Repro Status</th>
              <th className="py-2.5 px-3">Current Pen</th>
              <th className="py-2.5 px-3 text-center">Health</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E5DF]">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse bg-white">
                  <td className="py-3 px-3 text-center">
                    <div className="w-4 h-4 bg-slate-200 rounded mx-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-3.5 bg-slate-200 rounded w-24 mb-1" />
                    <div className="h-2.5 bg-slate-100 rounded w-16" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-3.5 bg-slate-200 rounded w-28 mb-1" />
                    <div className="h-2.5 bg-slate-100 rounded w-12" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="h-3 bg-slate-200 rounded w-6 mx-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-3.5 bg-slate-200 rounded w-24 mb-1" />
                    <div className="h-2.5 bg-slate-100 rounded w-14" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="h-3.5 bg-slate-200 rounded w-12 ml-auto mb-1" />
                    <div className="h-2.5 bg-slate-100 rounded w-8 ml-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-4 bg-slate-200 rounded w-24" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-3.5 bg-slate-200 rounded w-20" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="h-4 bg-slate-200 rounded w-16 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="h-6 bg-slate-200 rounded w-16 ml-auto" />
                  </td>
                </tr>
              ))
            ) : cows.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={11} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-[#F4F6F2] flex items-center justify-center text-[#717973] mb-3">
                      <Inbox className="w-6 h-6 text-[#1E3A2F]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1F2421]">No livestock registered yet</h3>
                    <p className="text-xs text-[#717973] mt-1 mb-4">
                      Get started by registering cattle to track milking records, veterinary history, and breeding milestones.
                    </p>
                    <Can permission={["COW_CREATE", "COW_WRITE"]}>
                      <button
                        type="button"
                        onClick={onRegisterCow}
                        className="h-8 px-3.5 bg-[#1E3A2F] text-white hover:bg-[#1b4332] rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Register New Cow</span>
                      </button>
                    </Can>
                  </div>
                </td>
              </tr>
            ) : (
              // Real Livestock Rows
              cows.map((cow) => {
                const isSelected = selectedIds.includes(cow.id);
                const py = density === "compact" ? "py-2" : "py-3";

                return (
                  <tr
                    key={cow.id}
                    className={`hover:bg-[#F8F9F6] transition-colors ${
                      isSelected ? "bg-[#c1ecd4]/20" : ""
                    } ${cow.healthStatus === "Quarantined" ? "bg-rose-50/30" : ""}`}
                  >
                    {/* Select Checkbox */}
                    <td className={`${py} px-3 text-center`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(cow.id)}
                        className="rounded border-[#E2E5DF] text-[#1E3A2F] focus:ring-[#1E3A2F] cursor-pointer"
                      />
                    </td>

                    {/* Tag Number & Cow Name */}
                    <td className={`${py} px-3`}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewProfile(cow)}
                          className="font-bold text-[#1E3A2F] hover:underline font-mono text-xs text-left"
                        >
                          {cow.tagNumber}
                        </button>
                        {cow.estrusAlert && (
                          <span className="flex h-2 w-2 relative" title="High Activity / Estrus Alert">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#717973] truncate max-w-[120px]">
                        {cow.name}
                      </div>
                    </td>

                    {/* Breed & Age */}
                    <td className={`${py} px-3`}>
                      <div className="text-[#1F2421] font-medium">{cow.breed}</div>
                      <div className="text-[11px] text-[#717973]">{cow.age}</div>
                    </td>

                    {/* Parity (Calvings) */}
                    <td className={`${py} px-3 text-center`}>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-[#F4F6F2] text-[#414844] font-semibold text-[11px]">
                        {cow.parity}
                      </span>
                    </td>

                    {/* Lactation Stage / DIM */}
                    <td className={`${py} px-3`}>
                      <div className="font-medium text-[#1F2421]">{cow.lactationStage} Stage</div>
                      <div className="text-[11px] text-[#717973]">
                        {cow.dim !== null ? `${cow.dim} DIM` : "Dry / Calving Pending"}
                      </div>
                    </td>

                    {/* Yield (Today vs 7d Diff) */}
                    <td className={`${py} px-3 text-right`}>
                      {cow.todayYield !== null ? (
                        <>
                          <div className="font-bold text-[#1F2421] font-mono">
                            {cow.todayYield.toFixed(1)} L
                          </div>
                          {cow.yieldDiff && (
                            <div
                              className={`text-[10px] font-semibold ${
                                cow.yieldDiff.startsWith("+")
                                  ? "text-emerald-700"
                                  : cow.yieldDiff.startsWith("-")
                                  ? "text-rose-700"
                                  : "text-[#717973]"
                              }`}
                            >
                              {cow.yieldDiff}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-[#717973] text-[11px]">--</span>
                      )}
                    </td>

                    {/* Somatic Cell Count (SCC) */}
                    <td className={`${py} px-3`}>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cow.sccStatus === "danger"
                              ? "bg-red-600"
                              : cow.sccStatus === "warning"
                              ? "bg-amber-500"
                              : "bg-emerald-600"
                          }`}
                        />
                        <span
                          className={`text-[11px] font-medium ${
                            cow.sccStatus === "danger"
                              ? "text-red-700 font-semibold"
                              : cow.sccStatus === "warning"
                              ? "text-amber-800"
                              : "text-[#414844]"
                          }`}
                        >
                          {cow.sccValue}
                        </span>
                      </div>
                    </td>

                    {/* Reproduction Status */}
                    <td className={`${py} px-3`}>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          cow.reproVariant === "success"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : cow.reproVariant === "warning"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : cow.reproVariant === "danger"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : cow.reproVariant === "info"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {cow.reproStatus}
                      </span>
                    </td>

                    {/* Barn & Pen Location */}
                    <td className={`${py} px-3 text-[#414844] font-medium`}>
                      {cow.currentPen}
                    </td>

                    {/* Health Status Indicator */}
                    <td className={`${py} px-3 text-center`}>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          cow.healthStatus === "Healthy"
                            ? "bg-emerald-50 text-emerald-800"
                            : cow.healthStatus === "Quarantined"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cow.statusDot === "green"
                              ? "bg-emerald-600"
                              : cow.statusDot === "red"
                              ? "bg-rose-600"
                              : cow.statusDot === "amber"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {cow.healthStatus}
                      </span>
                    </td>

                    {/* Inline Actions */}
                    <td className={`${py} px-3 text-right`}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewProfile(cow)}
                          className="p-1 text-[#717973] hover:text-[#1E3A2F] hover:bg-[#F4F6F2] rounded transition-colors"
                          title="View Livestock Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <Can permission={["COW_UPDATE", "COW_WRITE"]}>
                          <button
                            type="button"
                            onClick={() => onEditCow?.(cow)}
                            className="p-1 text-[#717973] hover:text-[#1E3A2F] hover:bg-[#F4F6F2] rounded transition-colors"
                            title="Edit Cow Attributes"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Can>

                        <button
                          type="button"
                          onClick={() => onBreedCow?.(cow)}
                          className="p-1 text-[#717973] hover:text-[#006c48] hover:bg-[#F4F6F2] rounded transition-colors"
                          title="Breeding & Insemination"
                        >
                          <Dna className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onAddHealthNote?.(cow)}
                          className={`p-1 rounded transition-colors ${
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
                          className={`p-1 rounded transition-colors ${
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      <div className="px-4 py-2.5 bg-[#F4F6F2] border-t border-[#E2E5DF] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#717973]">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="h-7 text-xs bg-white border border-[#E2E5DF] rounded px-2 focus:outline-none focus:border-[#1E3A2F] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">
            {startRecord}–{endRecord} of {totalCount} animals
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 0}
            onClick={() => onPageChange?.(0)}
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#717973] disabled:opacity-40 hover:bg-[#F8F9F6] cursor-pointer"
            title="First Page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={currentPage <= 0}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#717973] disabled:opacity-40 hover:bg-[#F8F9F6] cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-xs font-semibold text-[#1E3A2F]">
            Page {currentPage + 1} of {Math.max(1, totalPages)}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#1F2421] disabled:opacity-40 hover:bg-[#F8F9F6] cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange?.(totalPages - 1)}
            className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E5DF] bg-white text-[#1F2421] disabled:opacity-40 hover:bg-[#F8F9F6] cursor-pointer"
            title="Last Page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
