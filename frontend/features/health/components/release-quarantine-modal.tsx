"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { QuarantineRecord, CowHealthStatus } from "@/types/health";
import { useReleaseQuarantine } from "../hooks/use-health";

interface ReleaseQuarantineModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: QuarantineRecord | null;
}

export function ReleaseQuarantineModal({
  isOpen,
  onClose,
  record,
}: ReleaseQuarantineModalProps) {
  const [actualReleaseDate, setActualReleaseDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [nextHealthStatus, setNextHealthStatus] =
    useState<CowHealthStatus>("HEALTHY");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const releaseMutation = useReleaseQuarantine();

  if (!isOpen || !record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await releaseMutation.mutateAsync({
        id: record.id,
        data: {
          actualReleaseDate,
          nextHealthStatus,
          notes: notes.trim() || undefined,
        },
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to release animal from quarantine isolation."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between p-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-[#1E3A2F] font-headline">
                Release from Quarantine Isolation
              </h3>
              <p className="text-[11px] text-[#717973]">
                {record.cowTagNumber} {record.cowName ? `• ${record.cowName}` : ""} ({record.location})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#717973] hover:text-[#1F2421] hover:bg-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-1">
            <div className="font-semibold text-emerald-900">
              Clearance Authorization
            </div>
            <div className="text-[11px] text-emerald-700">
              Releasing this animal will update its health status, remove physical bay isolation,
              and record veterinary sign-off.
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#1F2421] mb-1">
              Release Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={actualReleaseDate}
              onChange={(e) => setActualReleaseDate(e.target.value)}
              required
              className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#1F2421] mb-1">
              Next Health Status <span className="text-red-500">*</span>
            </label>
            <select
              value={nextHealthStatus}
              onChange={(e) => setNextHealthStatus(e.target.value as CowHealthStatus)}
              className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
            >
              <option value="HEALTHY">HEALTHY (Full Milking Return)</option>
              <option value="RECOVERING">RECOVERING (General Observation)</option>
              <option value="OBSERVATION">OBSERVATION (Monitored)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#1F2421] mb-1">
              Veterinary Clearance Notes / Sign-Off
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Clinical inspection negative. Normal body temperature 38.5C. Clear for milking."
              className="w-full p-2 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E5DF] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#E2E5DF] text-[#717973] hover:text-[#1F2421] hover:bg-gray-50 rounded font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={releaseMutation.isPending}
              className="px-4 py-1.5 bg-[#1E3A2F] text-white hover:bg-[#1b4332] rounded font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
            >
              {releaseMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Confirm Release</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
