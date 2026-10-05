"use client";

import React, { useState } from "react";
import {
  Heart,
  Search,
  Plus,
  AlertTriangle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { PregnancyStatus, PregnancyRecord } from "@/types/breeding";
import {
  usePregnancies,
  useMarkNotPregnant,
  useMarkPregnancyLost,
} from "../hooks/use-breeding";

interface PregnancyMonitoringTableProps {
  onNewPregnancyCheck?: () => void;
  onRecordCalving?: (record: PregnancyRecord) => void;
}

export function PregnancyMonitoringTable({
  onNewPregnancyCheck,
  onRecordCalving,
}: PregnancyMonitoringTableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PregnancyStatus | "">("");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const { data: response, isLoading } = usePregnancies({
    page,
    size: 10,
    search: search || undefined,
    pregnancyStatus: selectedStatus || undefined,
    overdueOnly: overdueOnly || undefined,
  });

  const markNotPregnantMutation = useMarkNotPregnant();
  const markLostMutation = useMarkPregnancyLost();

  const pageData = response?.data;
  const records = pageData?.content || [];

  const getStatusBadge = (status: PregnancyStatus) => {
    switch (status) {
      case "CONFIRMED":
        return { label: "Confirmed Pregnant", color: "bg-pink-50 text-pink-700 border-pink-200" };
      case "PENDING":
        return { label: "Pending Exam", color: "bg-amber-50 text-amber-700 border-amber-200" };
      case "NOT_PREGNANT":
        return { label: "Open / Not Pregnant", color: "bg-slate-50 text-slate-600 border-slate-200" };
      case "LOST":
        return { label: "Pregnancy Lost", color: "bg-rose-50 text-rose-700 border-rose-200" };
      case "COMPLETED":
        return { label: "Calved / Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      default:
        return { label: status, color: "bg-slate-50 text-slate-600 border-slate-200" };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-[#E2E5DF] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <h2 className="text-base font-bold text-[#1F2421] font-headline">
              Gestation & Pregnancy Monitoring
            </h2>
            <span className="text-xs text-[#717973] font-medium">
              ({pageData?.totalElements ?? 0} Tracked)
            </span>
          </div>
          <p className="text-xs text-[#717973] mt-0.5">
            Ultrasound verification, countdown timers to calving, and maternity pen triage
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Overdue Checkbox Toggle */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-xs font-semibold text-[#1F2421] cursor-pointer hover:bg-[#F4F6F2]">
            <input
              type="checkbox"
              checked={overdueOnly}
              onChange={(e) => {
                setOverdueOnly(e.target.checked);
                setPage(0);
              }}
              className="rounded border-[#E2E5DF] text-[#1E3A2F] focus:ring-0"
            />
            <span className="text-rose-600 font-bold">Overdue Only</span>
          </label>

          {/* Search Input */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#717973]" />
            <input
              type="text"
              placeholder="Search cow tag..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as PregnancyStatus | "");
              setPage(0);
            }}
            className="py-1.5 px-2.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending Check</option>
            <option value="COMPLETED">Calved (Completed)</option>
            <option value="NOT_PREGNANT">Not Pregnant</option>
            <option value="LOST">Lost</option>
          </select>

          {onNewPregnancyCheck && (
            <button
              onClick={onNewPregnancyCheck}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#162e25] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Pregnancy Check</span>
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
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Exam Method & Date</th>
              <th className="px-4 py-3">Expected Calving</th>
              <th className="px-4 py-3">Days Remaining</th>
              <th className="px-4 py-3">Examiner</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E5DF]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#1E3A2F] border-t-transparent animate-spin" />
                    <span>Loading pregnancy records...</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  No pregnancy records match the selected filters.
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const statusInfo = getStatusBadge(record.pregnancyStatus);
                const isConfirmed = record.pregnancyStatus === "CONFIRMED";
                const isOverdue = Boolean(record.isOverdue);
                const daysRemaining = record.daysRemaining ?? 0;

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
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1F2421]">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {record.confirmationMethod
                            ? record.confirmationMethod.replace("_", " ")
                            : "Awaiting Exam"}
                        </span>
                        <span className="text-[10px] text-[#717973]">
                          {record.confirmationDate || "Pending"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#1E3A2F]">
                      {record.expectedCalvingDate || "--"}
                    </td>
                    <td className="px-4 py-3">
                      {isConfirmed && record.expectedCalvingDate ? (
                        isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            Overdue ({Math.abs(daysRemaining)}d)
                          </span>
                        ) : daysRemaining <= 14 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Near Calving ({daysRemaining}d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {daysRemaining} days left
                          </span>
                        )
                      ) : (
                        <span className="text-[#717973] text-[11px]">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#717973]">
                      {record.confirmedByName || "Veterinarian"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isConfirmed && onRecordCalving && (
                          <button
                            onClick={() => onRecordCalving(record)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E3A2F] text-white text-[11px] font-semibold rounded hover:bg-[#162e25] transition-colors shadow-2xs"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-300" />
                            <span>Record Calving</span>
                          </button>
                        )}

                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => markNotPregnantMutation.mutate(record.id)}
                              disabled={markNotPregnantMutation.isPending}
                              className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-medium rounded hover:bg-slate-100"
                              title="Mark Not Pregnant (Re-evaluated Open)"
                            >
                              Open
                            </button>
                            <button
                              onClick={() => markLostMutation.mutate(record.id)}
                              disabled={markLostMutation.isPending}
                              className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium rounded hover:bg-rose-100"
                              title="Record Pregnancy Loss / Miscarriage"
                            >
                              Lost
                            </button>
                          </>
                        )}
                      </div>
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
