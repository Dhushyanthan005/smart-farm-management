"use client";

import React, { useState } from "react";
import { X, ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";
import { useCreateQuarantine } from "../hooks/use-health";
import { cowApi } from "@/lib/api/cow-api";
import { Cow } from "@/types/cow";

interface AssignQuarantineModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBay?: string;
}

export function AssignQuarantineModal({
  isOpen,
  onClose,
  defaultBay,
}: AssignQuarantineModalProps) {
  const [cowSearch, setCowSearch] = useState("");
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [matchingCows, setMatchingCows] = useState<Cow[]>([]);
  const [isSearchingCows, setIsSearchingCows] = useState(false);

  const [location, setLocation] = useState(defaultBay || "Bay 01 - North");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expectedReleaseDate, setExpectedReleaseDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateQuarantine();

  if (!isOpen) return null;

  const handleSearchCows = async (query: string) => {
    setCowSearch(query);
    if (query.trim().length < 2) {
      setMatchingCows([]);
      return;
    }

    setIsSearchingCows(true);
    try {
      const res = await cowApi.list({ search: query.trim(), size: 5 });
      setMatchingCows(res.data?.content || []);
    } catch {
      setMatchingCows([]);
    } finally {
      setIsSearchingCows(false);
    }
  };

  const handleSelectCow = (cow: Cow) => {
    setSelectedCow(cow);
    setCowSearch(`${cow.tagNumber} ${cow.name ? `(${cow.name})` : ""}`);
    setMatchingCows([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCow && !cowSearch.trim()) {
      setError("Please specify a cow tag or select an animal.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        cowId: selectedCow?.id,
        cowTagNumber: selectedCow ? undefined : cowSearch.trim(),
        location: location.trim(),
        startDate,
        expectedReleaseDate: expectedReleaseDate || undefined,
        reason: reason.trim(),
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to assign cow to quarantine isolation."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between p-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-bold text-[#1E3A2F] font-headline">
                Assign Animal to Quarantine Isolation
              </h3>
              <p className="text-[11px] text-[#717973]">
                Physical stanchion allocation with automated line lockout
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

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Cow Selector */}
          <div className="relative">
            <label className="block font-medium text-[#1F2421] mb-1">
              Select Animal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cowSearch}
              onChange={(e) => handleSearchCows(e.target.value)}
              placeholder="Search tag number or name..."
              required
              className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
            />
            {matchingCows.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-[#E2E5DF] rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                {matchingCows.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCow(c)}
                    className="w-full text-left p-2 hover:bg-[#F8F9F6] border-b border-[#E2E5DF] last:border-none flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#1E3A2F]">
                        {c.tagNumber}
                      </span>
                      {c.name && <span className="ml-2 text-[#717973]">{c.name}</span>}
                    </div>
                    <span className="text-[10px] text-[#717973] uppercase">
                      {c.breed} • {c.healthStatus}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1F2421] mb-1">
                Quarantine Bay / Location <span className="text-red-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="Bay 01 - North">Bay 01 - North</option>
                <option value="Bay 02 - East">Bay 02 - East</option>
                <option value="Bay 03 - South">Bay 03 - South</option>
                <option value="Bay 04 - West">Bay 04 - West</option>
                <option value="Quarantine Q-1">Quarantine Q-1</option>
                <option value="Quarantine Q-2">Quarantine Q-2</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#1F2421] mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#1F2421] mb-1">
              Expected Release Date
            </label>
            <input
              type="date"
              value={expectedReleaseDate}
              onChange={(e) => setExpectedReleaseDate(e.target.value)}
              className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#1F2421] mb-1">
              Isolation Reason / Clinical Diagnosis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Acute Clinical Mastitis, Infectious Foot Rot, Suspected BVD"
              required
              className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#1F2421] mb-1">
              Isolation Protocols &amp; Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Bio-isolated milking unit required. Sanitize boots after inspection."
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
              disabled={createMutation.isPending}
              className="px-4 py-1.5 bg-red-700 text-white hover:bg-red-800 rounded font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
            >
              {createMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Assign to Quarantine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
