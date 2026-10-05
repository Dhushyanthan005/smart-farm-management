"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Users,
} from "lucide-react";
import { CalvingType, CalvingRecord } from "@/types/breeding";
import { useCalvings } from "../hooks/use-breeding";

interface CalvingLogTableProps {
  onNewCalving?: () => void;
}

export function CalvingLogTable({ onNewCalving }: CalvingLogTableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<CalvingType | "">("");
  const [complicationsOnly, setComplicationsOnly] = useState(false);

  const { data: response, isLoading } = useCalvings({
    page,
    size: 10,
    search: search || undefined,
    calvingType: selectedType || undefined,
    complicationsOnly: complicationsOnly || undefined,
  });

  const pageData = response?.data;
  const records = pageData?.content || [];

  const getCalvingTypeBadge = (type: CalvingType) => {
    switch (type) {
      case "NORMAL":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ASSISTED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CESAREAN":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-[#E2E5DF] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-base font-bold text-[#1F2421] font-headline">
              Calving & Birth Register
            </h2>
            <span className="text-xs text-[#717973] font-medium">
              ({pageData?.totalElements ?? 0} Births)
            </span>
          </div>
          <p className="text-xs text-[#717973] mt-0.5">
            Calf delivery outcomes, maternal parity increments, and obstetric complications
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Complications Toggle */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-xs font-semibold text-[#1F2421] cursor-pointer hover:bg-[#F4F6F2]">
            <input
              type="checkbox"
              checked={complicationsOnly}
              onChange={(e) => {
                setComplicationsOnly(e.target.checked);
                setPage(0);
              }}
              className="rounded border-[#E2E5DF] text-[#1E3A2F] focus:ring-0"
            />
            <span className="text-amber-700">Complications Only</span>
          </label>

          {/* Search Input */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#717973]" />
            <input
              type="text"
              placeholder="Search tag, details..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Calving Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as CalvingType | "");
              setPage(0);
            }}
            className="py-1.5 px-2.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">All Delivery Types</option>
            <option value="NORMAL">Normal / Unassisted</option>
            <option value="ASSISTED">Assisted Traction</option>
            <option value="CESAREAN">Cesarean Section</option>
            <option value="OTHER">Other</option>
          </select>

          {onNewCalving && (
            <button
              onClick={onNewCalving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#162e25] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Calving</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F9F6] text-[#717973] uppercase tracking-wider text-[10px] font-semibold border-b border-[#E2E5DF]">
            <tr>
              <th className="px-4 py-3">Cow / Identifier</th>
              <th className="px-4 py-3">Calving Date</th>
              <th className="px-4 py-3">Delivery Type</th>
              <th className="px-4 py-3">Calf Count & Details</th>
              <th className="px-4 py-3">Complications</th>
              <th className="px-4 py-3">Assistance</th>
              <th className="px-4 py-3">Veterinarian / Attendant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E5DF]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#1E3A2F] border-t-transparent animate-spin" />
                    <span>Loading calving records...</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  No calving records found matching criteria.
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const hasComplications = Boolean(
                  record.complications && record.complications.trim() !== ""
                );

                return (
                  <tr key={record.id} className="hover:bg-[#F8F9F6]/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1E3A2F] bg-[#E8F0EC] px-2 py-0.5 rounded text-[11px]">
                          {record.cowTagNumber}
                        </span>
                        {record.cowName && (
                          <span className="text-[#1F2421] font-medium">{record.cowName}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#1F2421] font-medium">
                      {record.calvingDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getCalvingTypeBadge(
                          record.calvingType
                        )}`}
                      >
                        {record.calvingType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1E3A2F]">
                          {record.calfCount} {record.calfCount === 1 ? "Calf" : "Calves"}
                        </span>
                        {record.calfDetails && (
                          <span
                            className="text-[11px] text-[#414844] max-w-xs truncate"
                            title={record.calfDetails}
                          >
                            {record.calfDetails}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {hasComplications ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded max-w-xs truncate"
                          title={record.complications!}
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                          <span className="truncate">{record.complications}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          None (Clean)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {record.assistanceRequired ? (
                        <span className="text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                          Assistance Given
                        </span>
                      ) : (
                        <span className="text-[#717973] text-[11px]">Unassisted</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#717973]">
                      {record.veterinarianName || "Maternity Attendant"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pageData && pageData.totalPages > 1 && (
        <div className="p-3 bg-[#F8F9F6] border-t border-[#E2E5DF] flex items-center justify-between text-xs text-[#717973]">
          <div>
            Showing Page {pageData.page + 1} of {pageData.totalPages} ({pageData.totalElements} items)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={pageData.first}
              className="px-2.5 py-1 bg-white border border-[#E2E5DF] rounded text-xs disabled:opacity-50 hover:bg-[#F4F6F2]"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageData.totalPages - 1, p + 1))}
              disabled={pageData.last}
              className="px-2.5 py-1 bg-white border border-[#E2E5DF] rounded text-xs disabled:opacity-50 hover:bg-[#F4F6F2]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
