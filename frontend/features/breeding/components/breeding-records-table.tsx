"use client";

import React, { useState } from "react";
import {
  Dna,
  Search,
  Plus,
  Check,
  X,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Ban,
  Activity,
} from "lucide-react";
import {
  BreedingMethod,
  BreedingStatus,
  BreedingRecord,
} from "@/types/breeding";
import {
  useBreedingRecords,
  useCompleteBreeding,
  useCancelBreeding,
} from "../hooks/use-breeding";

interface BreedingRecordsTableProps {
  onNewBreeding?: () => void;
  onConfirmPregnancy?: (record: BreedingRecord) => void;
}

export function BreedingRecordsTable({
  onNewBreeding,
  onConfirmPregnancy,
}: BreedingRecordsTableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<BreedingMethod | "">("");
  const [selectedStatus, setSelectedStatus] = useState<BreedingStatus | "">("");

  const { data: response, isLoading } = useBreedingRecords({
    page,
    size: 10,
    search: search || undefined,
    breedingMethod: selectedMethod || undefined,
    status: selectedStatus || undefined,
  });

  const completeMutation = useCompleteBreeding();
  const cancelMutation = useCancelBreeding();

  const pageData = response?.data;
  const records = pageData?.content || [];

  const getStatusBadge = (status: BreedingStatus) => {
    switch (status) {
      case "COMPLETED":
        return { label: "Completed", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "PLANNED":
        return { label: "Planned", icon: Clock, color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "CANCELLED":
        return { label: "Cancelled", icon: Ban, color: "bg-slate-50 text-slate-600 border-slate-200" };
      default:
        return { label: status, icon: Clock, color: "bg-slate-50 text-slate-600 border-slate-200" };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-[#E2E5DF] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" />
            <h2 className="text-base font-bold text-[#1F2421] font-headline">
              Insemination & Breeding Register
            </h2>
            <span className="text-xs text-[#717973] font-medium">
              ({pageData?.totalElements ?? 0} Inseminations)
            </span>
          </div>
          <p className="text-xs text-[#717973] mt-0.5">
            Log artificial inseminations (AI), pedigree sires, and natural service events
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#717973]" />
            <input
              type="text"
              placeholder="Search tag, bull, semen..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Method Filter */}
          <select
            value={selectedMethod}
            onChange={(e) => {
              setSelectedMethod(e.target.value as BreedingMethod | "");
              setPage(0);
            }}
            className="py-1.5 px-2.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">All Methods</option>
            <option value="ARTIFICIAL_INSEMINATION">Artificial Insemination (AI)</option>
            <option value="NATURAL">Natural Service</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as BreedingStatus | "");
              setPage(0);
            }}
            className="py-1.5 px-2.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PLANNED">Planned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {onNewBreeding && (
            <button
              onClick={onNewBreeding}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#162e25] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Insemination</span>
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
              <th className="px-4 py-3">Breeding Date</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Sire / Semen Reference</th>
              <th className="px-4 py-3">Technician / Vet</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E5DF]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#1E3A2F] border-t-transparent animate-spin" />
                    <span>Loading breeding records...</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  No breeding records found. Use &quot;Record Insemination&quot; to log a breeding event.
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const statusInfo = getStatusBadge(record.status);
                const StatusIcon = statusInfo.icon;
                const sireOrSemen = record.semenReference || record.bullTagNumber || "--";

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
                      {record.breedingDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#1F2421]">
                        {record.breedingMethod === "ARTIFICIAL_INSEMINATION" ? (
                          <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[10px]">
                            Artificial Insemination
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                            Natural Service
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-[#1E3A2F]">{sireOrSemen}</span>
                        {record.bullName && (
                          <span className="text-[10px] text-[#717973]">{record.bullName}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#414844]">
                      {record.technicianName || record.veterinarianName || "--"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {record.status === "COMPLETED" && onConfirmPregnancy && (
                          <button
                            onClick={() => onConfirmPregnancy(record)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-semibold rounded hover:bg-pink-100 transition-colors"
                            title="Confirm Pregnancy Exam"
                          >
                            <HeartHandshake className="w-3 h-3" />
                            <span>Check Pregnancy</span>
                          </button>
                        )}

                        {record.status === "PLANNED" && (
                          <>
                            <button
                              onClick={() => completeMutation.mutate(record.id)}
                              disabled={completeMutation.isPending}
                              className="p-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100"
                              title="Mark as Completed"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => cancelMutation.mutate(record.id)}
                              disabled={cancelMutation.isPending}
                              className="p-1 bg-rose-50 text-rose-700 border border-rose-200 rounded hover:bg-rose-100"
                              title="Cancel Insemination"
                            >
                              <X className="w-3.5 h-3.5" />
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
