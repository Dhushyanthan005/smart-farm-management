"use client";

import React, { useState } from "react";
import {
  Flame,
  Search,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle,
  Eye,
  Activity,
  Layers,
} from "lucide-react";
import { HeatDetectionMethod, HeatConfidence, HeatRecord } from "@/types/breeding";
import { useHeatRecords } from "../hooks/use-breeding";

interface HeatDetectionTableProps {
  onNewObservation?: () => void;
  onInseminate?: (record: HeatRecord) => void;
}

export function HeatDetectionTable({
  onNewObservation,
  onInseminate,
}: HeatDetectionTableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<HeatDetectionMethod | "">("");
  const [selectedConfidence, setSelectedConfidence] = useState<HeatConfidence | "">("");

  const { data: response, isLoading } = useHeatRecords({
    page,
    size: 10,
    search: search || undefined,
    detectionMethod: selectedMethod || undefined,
    confidence: selectedConfidence || undefined,
  });

  const pageData = response?.data;
  const records = pageData?.content || [];

  const getConfidenceBadge = (confidence: HeatConfidence) => {
    switch (confidence) {
      case "HIGH":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "LOW":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getMethodBadge = (method: HeatDetectionMethod) => {
    switch (method) {
      case "OBSERVATION":
        return { label: "Visual Observation", icon: Eye, color: "text-blue-700 bg-blue-50 border-blue-200" };
      case "MANUAL":
        return { label: "Manual Check", icon: Layers, color: "text-purple-700 bg-purple-50 border-purple-200" };
      case "DEVICE":
        return { label: "IoT Sensor / Collar", icon: Activity, color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
      default:
        return { label: method, icon: Flame, color: "text-stone-700 bg-stone-50 border-stone-200" };
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "--";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-[#E2E5DF] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-base font-bold text-[#1F2421] font-headline">
              Heat Cycle Detection Log
            </h2>
            <span className="text-xs text-[#717973] font-medium">
              ({pageData?.totalElements ?? 0} Observations)
            </span>
          </div>
          <p className="text-xs text-[#717973] mt-0.5">
            Identify cows in standing heat for timely artificial insemination
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#717973]" />
            <input
              type="text"
              placeholder="Search tag or signs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Detection Method Filter */}
          <select
            value={selectedMethod}
            onChange={(e) => {
              setSelectedMethod(e.target.value as HeatDetectionMethod | "");
              setPage(0);
            }}
            className="py-1.5 px-2.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">All Methods</option>
            <option value="OBSERVATION">Visual Observation</option>
            <option value="MANUAL">Manual Exam</option>
            <option value="DEVICE">Device / Sensor</option>
            <option value="OTHER">Other</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={selectedConfidence}
            onChange={(e) => {
              setSelectedConfidence(e.target.value as HeatConfidence | "");
              setPage(0);
            }}
            className="py-1.5 px-2.5 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">All Confidence</option>
            <option value="HIGH">High Confidence</option>
            <option value="MEDIUM">Medium Confidence</option>
            <option value="LOW">Low Confidence</option>
          </select>

          {onNewObservation && (
            <button
              onClick={onNewObservation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#162e25] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Heat</span>
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
              <th className="px-4 py-3">Detected Date & Time</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Signs Observed</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Observer</th>
              <th className="px-4 py-3 text-right">Operational Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E5DF]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#1E3A2F] border-t-transparent animate-spin" />
                    <span>Loading heat detection records...</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#717973]">
                  No heat detection observations found. Use &quot;Record Heat&quot; to log observed estrus signs.
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const methodInfo = getMethodBadge(record.detectionMethod);
                const MethodIcon = methodInfo.icon;

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
                      {formatDate(record.detectedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${methodInfo.color}`}
                      >
                        <MethodIcon className="w-3 h-3" />
                        {methodInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#414844] max-w-xs truncate" title={record.signsObserved}>
                      {record.signsObserved}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getConfidenceBadge(
                          record.confidence
                        )}`}
                      >
                        {record.confidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#717973]">
                      {record.detectedByName || "Staff"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {onInseminate && (
                        <button
                          onClick={() => onInseminate(record)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E3A2F] text-white text-[11px] font-semibold rounded hover:bg-[#162e25] transition-colors shadow-2xs"
                        >
                          <span>+ Inseminate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
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
