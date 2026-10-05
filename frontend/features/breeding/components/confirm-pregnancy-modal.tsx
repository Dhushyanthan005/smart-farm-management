"use client";

import React, { useState, useEffect } from "react";
import { X, Heart, AlertCircle, Loader2, Sparkles, Calendar } from "lucide-react";
import { useCreatePregnancy, useConfirmPregnancy } from "../hooks/use-breeding";
import { PregnancyConfirmationMethod } from "@/types/breeding";
import { cowApi } from "@/lib/api/cow-api";
import { Cow } from "@/types/cow";

interface ConfirmPregnancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCowId?: string;
  defaultCowTag?: string;
  defaultBreedingId?: string;
  defaultBreedingDate?: string;
  pregnancyIdToConfirm?: string;
}

export function ConfirmPregnancyModal({
  isOpen,
  onClose,
  defaultCowId,
  defaultCowTag,
  defaultBreedingId,
  defaultBreedingDate,
  pregnancyIdToConfirm,
}: ConfirmPregnancyModalProps) {
  const [cowSearch, setCowSearch] = useState("");
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [matchingCows, setMatchingCows] = useState<Cow[]>([]);
  const [isSearchingCows, setIsSearchingCows] = useState(false);

  // Form fields
  const [confirmationDate, setConfirmationDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [confirmationMethod, setConfirmationMethod] = useState<PregnancyConfirmationMethod>("ULTRASOUND");
  const [expectedCalvingDate, setExpectedCalvingDate] = useState("");
  const [confirmedByName, setConfirmedByName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createPregnancyMutation = useCreatePregnancy();
  const confirmPregnancyMutation = useConfirmPregnancy();

  // Auto-calculate expected calving date (breedingDate + 283 days, or confirmationDate + 248 days)
  useEffect(() => {
    if (defaultBreedingDate) {
      try {
        const bDate = new Date(defaultBreedingDate);
        bDate.setDate(bDate.getDate() + 283);
        setExpectedCalvingDate(bDate.toISOString().split("T")[0]);
      } catch {}
    } else if (confirmationDate) {
      try {
        const cDate = new Date(confirmationDate);
        cDate.setDate(cDate.getDate() + 248); // ~35 day confirmation
        setExpectedCalvingDate(cDate.toISOString().split("T")[0]);
      } catch {}
    }
  }, [defaultBreedingDate, confirmationDate]);

  // Search cows
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

  // Set default cow if provided
  useEffect(() => {
    if (defaultCowTag) {
      setCowSearch(defaultCowTag);
    } else if (defaultCowId && isOpen) {
      cowApi.getById(defaultCowId).then((res) => {
        if (res.data) {
          setSelectedCow(res.data);
          setCowSearch(res.data.tagNumber);
        }
      }).catch(() => {});
    }
  }, [defaultCowId, defaultCowTag, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cowTag = selectedCow ? selectedCow.tagNumber : cowSearch.trim();
    if (!cowTag && !pregnancyIdToConfirm) {
      setError("Please select or enter a cow ear tag number");
      return;
    }

    try {
      if (pregnancyIdToConfirm) {
        await confirmPregnancyMutation.mutateAsync({
          id: pregnancyIdToConfirm,
          data: {
            confirmationDate,
            confirmationMethod,
            expectedCalvingDate: expectedCalvingDate || undefined,
            confirmedByName: confirmedByName.trim() || undefined,
            notes: notes.trim() || undefined,
          },
        });
      } else {
        await createPregnancyMutation.mutateAsync({
          cowId: selectedCow?.id,
          cowTagNumber: cowTag,
          breedingId: defaultBreedingId,
          confirmationDate,
          confirmationMethod,
          expectedCalvingDate: expectedCalvingDate || undefined,
          pregnancyStatus: "CONFIRMED",
          confirmedByName: confirmedByName.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to confirm pregnancy");
    }
  };

  const isSubmitting = createPregnancyMutation.isPending || confirmPregnancyMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2E5DF] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2421] font-headline">
                Confirm Pregnancy Exam
              </h2>
              <p className="text-xs text-[#717973]">Record ultrasound or clinical exam result</p>
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
              Cow / Ear Tag <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cowSearch}
                onChange={(e) => {
                  setCowSearch(e.target.value);
                  setSelectedCow(null);
                }}
                disabled={Boolean(pregnancyIdToConfirm)}
                placeholder="Type tag number (e.g. COW-001)..."
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F] disabled:opacity-75"
              />
              {isSearchingCows && (
                <Loader2 className="w-4 h-4 text-[#717973] animate-spin absolute right-3 top-2.5" />
              )}
            </div>

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

          {/* Date & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Exam Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={confirmationDate}
                onChange={(e) => setConfirmationDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Confirmation Method <span className="text-red-500">*</span>
              </label>
              <select
                value={confirmationMethod}
                onChange={(e) => setConfirmationMethod(e.target.value as PregnancyConfirmationMethod)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="ULTRASOUND">Ultrasound Examination</option>
                <option value="VETERINARY_EXAM">Veterinary Palpation</option>
                <option value="MANUAL_EXAMINATION">Manual Examination</option>
                <option value="OTHER">Other / Blood PAG Test</option>
              </select>
            </div>
          </div>

          {/* Expected Calving Date */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1 flex items-center justify-between">
              <span>Expected Calving Date</span>
              <span className="text-[10px] text-[#717973] font-normal">
                Standard bovine gestation: 283 days
              </span>
            </label>
            <input
              type="date"
              value={expectedCalvingDate}
              onChange={(e) => setExpectedCalvingDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F] font-bold text-[#1E3A2F]"
            />
          </div>

          {/* Examiner */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Confirmed By (Veterinarian / Tech)
            </label>
            <input
              type="text"
              value={confirmedByName}
              onChange={(e) => setConfirmedByName(e.target.value)}
              placeholder="Dr. Sarah Jenkins..."
              className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Examination Findings / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Viable single fetus with strong heartbeat, fetal fluids clear"
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
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162e25] disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm Pregnancy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
