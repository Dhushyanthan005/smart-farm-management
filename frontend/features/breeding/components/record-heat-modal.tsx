"use client";

import React, { useState, useEffect } from "react";
import { X, Flame, AlertCircle, Loader2 } from "lucide-react";
import { useCreateHeatRecord } from "../hooks/use-breeding";
import { HeatDetectionMethod, HeatConfidence } from "@/types/breeding";
import { cowApi } from "@/lib/api/cow-api";
import { Cow } from "@/types/cow";

interface RecordHeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCowId?: string;
}

export function RecordHeatModal({
  isOpen,
  onClose,
  defaultCowId,
}: RecordHeatModalProps) {
  const [cowSearch, setCowSearch] = useState("");
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [matchingCows, setMatchingCows] = useState<Cow[]>([]);
  const [isSearchingCows, setIsSearchingCows] = useState(false);

  // Form fields
  const [detectedAt, setDetectedAt] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [detectionMethod, setDetectionMethod] = useState<HeatDetectionMethod>("OBSERVATION");
  const [signsObserved, setSignsObserved] = useState("Standing to be mounted, clear mucus discharge");
  const [confidence, setConfidence] = useState<HeatConfidence>("HIGH");
  const [detectedByName, setDetectedByName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createHeatMutation = useCreateHeatRecord();

  // Search cows when user types
  useEffect(() => {
    if (!cowSearch.trim() || selectedCow) {
      setMatchingCows([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingCows(true);
      try {
        const res = await cowApi.list({ search: cowSearch.trim(), size: 5 });
        setMatchingCows(res.data?.content || []);
      } catch {
        setMatchingCows([]);
      } finally {
        setIsSearchingCows(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [cowSearch, selectedCow]);

  // Load default cow if provided
  useEffect(() => {
    if (defaultCowId && isOpen) {
      cowApi.getById(defaultCowId).then((res) => {
        if (res.data) {
          setSelectedCow(res.data);
          setCowSearch(res.data.tagNumber);
        }
      }).catch(() => {});
    }
  }, [defaultCowId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cowTag = selectedCow ? selectedCow.tagNumber : cowSearch.trim();
    if (!cowTag) {
      setError("Please select or enter a cow ear tag number");
      return;
    }

    if (!signsObserved.trim()) {
      setError("Observed signs of heat are required");
      return;
    }

    try {
      await createHeatMutation.mutateAsync({
        cowId: selectedCow?.id,
        cowTagNumber: cowTag,
        detectedAt: new Date(detectedAt).toISOString().replace("Z", ""),
        detectionMethod,
        signsObserved: signsObserved.trim(),
        confidence,
        detectedByName: detectedByName.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to record heat detection");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2E5DF] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2421] font-headline">
                Record Heat Observation
              </h2>
              <p className="text-xs text-[#717973]">Log estrus detection for reproductive cycle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#717973] hover:text-[#1F2421] hover:bg-[#E2E5DF]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cow Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Cow / Ear Tag Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cowSearch}
                onChange={(e) => {
                  setCowSearch(e.target.value);
                  setSelectedCow(null);
                }}
                placeholder="Type tag number (e.g. COW-001)..."
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
              {isSearchingCows && (
                <Loader2 className="w-4 h-4 text-[#717973] animate-spin absolute right-3 top-2.5" />
              )}
            </div>

            {/* Cow search dropdown */}
            {matchingCows.length > 0 && !selectedCow && (
              <div className="mt-1 bg-white border border-[#E2E5DF] rounded-lg shadow-lg overflow-hidden divide-y divide-[#E2E5DF] z-10 relative">
                {matchingCows.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCow(c);
                      setCowSearch(c.tagNumber);
                      setMatchingCows([]);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-[#F8F9F6] flex items-center justify-between"
                  >
                    <span className="font-bold text-[#1E3A2F]">{c.tagNumber}</span>
                    <span className="text-[#717973]">{c.name || c.breed} • Parity {c.parity}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Detection Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={detectedAt}
                onChange={(e) => setDetectedAt(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Detection Method <span className="text-red-500">*</span>
              </label>
              <select
                value={detectionMethod}
                onChange={(e) => setDetectionMethod(e.target.value as HeatDetectionMethod)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="OBSERVATION">Visual Observation (Standing Heat)</option>
                <option value="MANUAL">Manual Palpation / Examination</option>
                <option value="DEVICE">Device / Activity Sensor</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Signs Observed */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Signs Observed <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={signsObserved}
              onChange={(e) => setSignsObserved(e.target.value)}
              placeholder="e.g. Standing to be mounted, clear mucus, restless, bellowing"
              className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Confidence & Observer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Confidence Level
              </label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as HeatConfidence)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="HIGH">High (Definitive Standing Heat)</option>
                <option value="MEDIUM">Medium (Secondary Signs Observed)</option>
                <option value="LOW">Low (Suspected / Pre-estrus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Observed By (Staff / Tech)
              </label>
              <input
                type="text"
                value={detectedByName}
                onChange={(e) => setDetectedByName(e.target.value)}
                placeholder="Staff name..."
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Clinical / Behavioral Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E2E5DF] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#717973] hover:text-[#1F2421] bg-white border border-[#E2E5DF] rounded-lg hover:bg-[#F8F9F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createHeatMutation.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162e25] disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              {createHeatMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Save Observation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
