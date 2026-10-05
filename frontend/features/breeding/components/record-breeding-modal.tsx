"use client";

import React, { useState, useEffect } from "react";
import { X, Dna, AlertCircle, Loader2 } from "lucide-react";
import { useCreateBreeding } from "../hooks/use-breeding";
import { BreedingMethod, BreedingStatus } from "@/types/breeding";
import { cowApi } from "@/lib/api/cow-api";
import { Cow } from "@/types/cow";

interface RecordBreedingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCowId?: string;
  defaultCowTag?: string;
  defaultHeatRecordId?: string;
}

export function RecordBreedingModal({
  isOpen,
  onClose,
  defaultCowId,
  defaultCowTag,
  defaultHeatRecordId,
}: RecordBreedingModalProps) {
  const [cowSearch, setCowSearch] = useState("");
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [matchingCows, setMatchingCows] = useState<Cow[]>([]);
  const [isSearchingCows, setIsSearchingCows] = useState(false);

  // Form fields
  const [breedingDate, setBreedingDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [breedingMethod, setBreedingMethod] = useState<BreedingMethod>("ARTIFICIAL_INSEMINATION");
  const [semenReference, setSemenReference] = useState("");
  const [bullTagNumber, setBullTagNumber] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [veterinarianName, setVeterinarianName] = useState("");
  const [status, setStatus] = useState<BreedingStatus>("COMPLETED");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createBreedingMutation = useCreateBreeding();

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

    if (breedingMethod === "ARTIFICIAL_INSEMINATION" && !semenReference.trim()) {
      setError("Semen straw batch / reference is required for Artificial Insemination");
      return;
    }

    try {
      await createBreedingMutation.mutateAsync({
        cowId: selectedCow?.id,
        cowTagNumber: cowTag,
        breedingDate,
        breedingMethod,
        semenReference: breedingMethod === "ARTIFICIAL_INSEMINATION" ? semenReference.trim() : undefined,
        bullTagNumber: breedingMethod === "NATURAL" ? bullTagNumber.trim() : undefined,
        technicianName: technicianName.trim() || undefined,
        veterinarianName: veterinarianName.trim() || undefined,
        heatRecordId: defaultHeatRecordId,
        status,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to log breeding event");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2E5DF] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Dna className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2421] font-headline">
                Record Insemination / Mating
              </h2>
              <p className="text-xs text-[#717973]">Log pedigree genetics and service event</p>
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
              Cow / Dam Ear Tag <span className="text-red-500">*</span>
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

          {/* Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Breeding Method <span className="text-red-500">*</span>
              </label>
              <select
                value={breedingMethod}
                onChange={(e) => setBreedingMethod(e.target.value as BreedingMethod)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="ARTIFICIAL_INSEMINATION">Artificial Insemination (AI)</option>
                <option value="NATURAL">Natural Service</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Breeding Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={breedingDate}
                onChange={(e) => setBreedingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          {/* AI Semen Ref or Bull Tag */}
          {breedingMethod === "ARTIFICIAL_INSEMINATION" ? (
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Semen Straw Reference / Sire ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={semenReference}
                onChange={(e) => setSemenReference(e.target.value)}
                placeholder="e.g. SEM-HOL-2026-X or NAAB 29HO1899"
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Breeding Bull Tag Number
              </label>
              <input
                type="text"
                value={bullTagNumber}
                onChange={(e) => setBullTagNumber(e.target.value)}
                placeholder="e.g. BULL-09"
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          )}

          {/* Personnel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                AI Technician Name
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="Inseminator name..."
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Supervising Veterinarian
              </label>
              <input
                type="text"
                value={veterinarianName}
                onChange={(e) => setVeterinarianName(e.target.value)}
                placeholder="Veterinarian name..."
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Service Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BreedingStatus)}
                className="w-full px-3 py-2 text-xs bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="COMPLETED">Completed (Administered)</option>
                <option value="PLANNED">Planned (Scheduled)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Insemination notes, straw thaw temperature, etc."
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
              disabled={createBreedingMutation.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162e25] disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              {createBreedingMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Record Insemination</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
