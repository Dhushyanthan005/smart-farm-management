"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useCreateCalving } from "../hooks/use-breeding";
import { CalvingType } from "@/types/breeding";
import { cowApi } from "@/lib/api/cow-api";
import { Cow } from "@/types/cow";

interface RecordCalvingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCowId?: string;
  defaultCowTag?: string;
  defaultPregnancyId?: string;
}

export function RecordCalvingModal({
  isOpen,
  onClose,
  defaultCowId,
  defaultCowTag,
  defaultPregnancyId,
}: RecordCalvingModalProps) {
  const [cowSearch, setCowSearch] = useState("");
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [matchingCows, setMatchingCows] = useState<Cow[]>([]);
  const [isSearchingCows, setIsSearchingCows] = useState(false);

  // Form fields
  const [calvingDate, setCalvingDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [calvingType, setCalvingType] = useState<CalvingType>("NORMAL");
  const [calfCount, setCalfCount] = useState<number>(1);
  const [calfDetails, setCalfDetails] = useState("Single heifer calf, 38 kg, vigorous");
  const [complications, setComplications] = useState("");
  const [assistanceRequired, setAssistanceRequired] = useState(false);
  const [veterinarianName, setVeterinarianName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createCalvingMutation = useCreateCalving();

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
    if (!cowTag) {
      setError("Please select or enter a cow ear tag number");
      return;
    }

    try {
      await createCalvingMutation.mutateAsync({
        cowId: selectedCow?.id,
        cowTagNumber: cowTag,
        pregnancyId: defaultPregnancyId,
        calvingDate,
        calvingType,
        calfCount: Number(calfCount) || 1,
        calfDetails: calfDetails.trim() || undefined,
        complications: complications.trim() || undefined,
        assistanceRequired,
        veterinarianName: veterinarianName.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to log calving event");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2E5DF] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2421] font-headline">
                Record Calving / Delivery
              </h2>
              <p className="text-xs text-[#717973]">
                Logs delivery, increments parity, transitions cow to fresh lactation
              </p>
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
              Dam / Mother Cow Ear Tag <span className="text-red-500">*</span>
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

          {/* Calving Date & Delivery Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Calving Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={calvingDate}
                onChange={(e) => setCalvingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Delivery Type <span className="text-red-500">*</span>
              </label>
              <select
                value={calvingType}
                onChange={(e) => setCalvingType(e.target.value as CalvingType)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="NORMAL">Normal / Unassisted</option>
                <option value="ASSISTED">Assisted Traction</option>
                <option value="CESAREAN">Cesarean Section</option>
                <option value="OTHER">Other Intervention</option>
              </select>
            </div>
          </div>

          {/* Calf Count & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Calf Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={4}
                value={calfCount}
                onChange={(e) => setCalfCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Calf Details (Gender, Weight, ID)
              </label>
              <input
                type="text"
                value={calfDetails}
                onChange={(e) => setCalfDetails(e.target.value)}
                placeholder="e.g. Heifer calf, 40kg, strong colostrum intake"
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          {/* Complications & Assistance */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Obstetric Complications
            </label>
            <input
              type="text"
              value={complications}
              onChange={(e) => setComplications(e.target.value)}
              placeholder="Leave blank if clean birth, or e.g. Mild dystocia, retained placenta"
              className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="assistReq"
              checked={assistanceRequired}
              onChange={(e) => setAssistanceRequired(e.target.checked)}
              className="rounded border-[#E2E5DF] text-[#1E3A2F] focus:ring-0"
            />
            <label htmlFor="assistReq" className="text-xs text-[#1F2421] font-medium cursor-pointer">
              Veterinary / Manual assistance was required during delivery
            </label>
          </div>

          {/* Veterinarian / Attendant */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Attending Veterinarian / Maternity Staff
            </label>
            <input
              type="text"
              value={veterinarianName}
              onChange={(e) => setVeterinarianName(e.target.value)}
              placeholder="Attendant name..."
              className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Post-calving colostrum feeding, dam recovery observations..."
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
              disabled={createCalvingMutation.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162e25] disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              {createCalvingMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Complete Calving Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
