"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Stethoscope, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTreatments, useCompleteTreatment } from "../hooks/use-health";
import { Treatment, TreatmentStatus } from "@/types/health";

interface TreatmentLogTableProps {
  onNewCheck?: () => void;
}

export function TreatmentLogTable({ onNewCheck }: TreatmentLogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: response, isLoading } = useTreatments({
    search: searchTerm.trim() || undefined,
    status: statusFilter !== "ALL" ? (statusFilter as TreatmentStatus) : undefined,
    page,
    size: pageSize,
    sort: "createdAt,desc",
  });

  const completeMutation = useCompleteTreatment();

  const treatments = response?.data?.content || [];
  const totalPages = response?.data?.totalPages || 0;
  const totalElements = response?.data?.totalElements || 0;

  const handleComplete = async (treatment: Treatment) => {
    if (confirm(`Mark treatment "${treatment.medication}" for ${treatment.cowTagNumber} as completed?`)) {
      try {
        await completeMutation.mutateAsync({
          id: treatment.id,
          data: {
            completionDate: new Date().toISOString().split("T")[0],
            notes: "Clinical symptoms cleared upon veterinary evaluation.",
          },
        });
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || "Failed to complete treatment.");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 bg-[#F8F9F6] border-b border-[#E2E5DF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#1E3A2F]" />
          <div>
            <h3 className="text-sm font-bold text-[#1E3A2F] font-headline">
              Clinical Veterinary Records &amp; Treatment Log
            </h3>
            <p className="text-xs text-[#717973]">Diagnoses, prescriptions, and veterinary round reports</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="h-8 px-2.5 text-xs bg-white border border-[#E2E5DF] rounded text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Treatments</option>
            <option value="COMPLETED">Completed Treatments</option>
          </select>

          {/* Search Input */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-[#717973] absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              placeholder="Search tag, medication..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          <button
            type="button"
            onClick={onNewCheck}
            className="h-8 px-3 bg-[#1E3A2F] text-white hover:bg-[#1b4332] text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Health Check</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8F9F6] border-b border-[#E2E5DF] text-[#717973] uppercase font-semibold text-[11px] h-9">
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Animal</th>
              <th className="py-2 px-3">Diagnosis / Chief Complaint</th>
              <th className="py-2 px-3">Medication / Protocol</th>
              <th className="py-2 px-3">Administered By</th>
              <th className="py-2 px-3 text-center">Withdrawal</th>
              <th className="py-2 px-3 text-right">Status</th>
              <th className="py-2 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E5DF] text-[#1F2421]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#717973]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1E3A2F]" />
                  Loading clinical veterinary treatments...
                </td>
              </tr>
            ) : treatments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#717973]">
                  No clinical treatments found matching your criteria.
                </td>
              </tr>
            ) : (
              treatments.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8F9F6] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[#717973] whitespace-nowrap">
                    {item.treatmentDate}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-mono font-bold text-[#1E3A2F]">{item.cowTagNumber}</div>
                    {item.cowName && (
                      <div className="text-[11px] text-[#717973]">{item.cowName}</div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-medium">
                    {item.diagnosis}
                    {item.treatmentType && (
                      <span className="ml-1.5 text-[10px] text-[#717973] uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.treatmentType}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-[#414844]">
                    <div>{item.medication}</div>
                    <div className="text-[11px] text-[#717973]">
                      {item.dosage} {item.route ? `• ${item.route}` : ""}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#717973]">
                    {item.veterinarianName || "Attending Tech"}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {item.withdrawalDays > 0 ? (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.withdrawalActive
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.withdrawalDays}d {item.withdrawalActive ? "(Active)" : "(Cleared)"}
                      </span>
                    ) : (
                      <span className="text-[#717973]">0d</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.status === "ACTIVE"
                          ? "bg-red-100 text-red-800"
                          : item.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {item.status === "ACTIVE" ? (
                      <button
                        type="button"
                        onClick={() => handleComplete(item)}
                        disabled={completeMutation.isPending}
                        className="px-2 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded cursor-pointer transition-colors"
                      >
                        Complete
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-[#F8F9F6] border-t border-[#E2E5DF] flex items-center justify-between text-xs text-[#717973]">
        <div>
          Showing {treatments.length} of {totalElements} treatment records
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page === 0 || isLoading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="p-1 rounded border border-[#E2E5DF] bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono">
            Page {page + 1} of {Math.max(1, totalPages)}
          </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages || isLoading}
            onClick={() => setPage((p) => p + 1)}
            className="p-1 rounded border border-[#E2E5DF] bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
