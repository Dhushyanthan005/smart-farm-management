"use client";

import React, { useState } from "react";
import { X, Stethoscope, Pill, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useCreateHealthRecord, useCreateTreatment } from "../hooks/use-health";
import { cowApi } from "@/lib/api/cow-api";
import { Cow } from "@/types/cow";
import { CowHealthStatus } from "@/types/health";

interface RecordHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCowId?: string;
}

export function RecordHealthModal({
  isOpen,
  onClose,
  defaultCowId,
}: RecordHealthModalProps) {
  const [activeTab, setActiveTab] = useState<"EXAM" | "TREATMENT">("EXAM");

  // Cow selection
  const [cowSearch, setCowSearch] = useState("");
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [matchingCows, setMatchingCows] = useState<Cow[]>([]);
  const [isSearchingCows, setIsSearchingCows] = useState(false);

  // Examination State
  const [examDate, setExamDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [healthStatus, setHealthStatus] =
    useState<CowHealthStatus>("UNDER_TREATMENT");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [temperature, setTemperature] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [veterinarianName, setVeterinarianName] = useState("");
  const [notes, setNotes] = useState("");

  // Treatment State
  const [treatmentDate, setTreatmentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [treatmentType, setTreatmentType] = useState("Antibiotic");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [route, setRoute] = useState("Intramammary");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]
  );
  const [withdrawalDays, setWithdrawalDays] = useState<number>(3);
  const [instructions, setInstructions] = useState("");

  const [error, setError] = useState<string | null>(null);

  const createHealthRecordMutation = useCreateHealthRecord();
  const createTreatmentMutation = useCreateTreatment();

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

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCow && !cowSearch.trim()) {
      setError("Please specify a cow tag or select an animal.");
      return;
    }

    try {
      await createHealthRecordMutation.mutateAsync({
        cowId: selectedCow?.id,
        cowTagNumber: selectedCow ? undefined : cowSearch.trim(),
        recordDate: examDate,
        healthStatus,
        diagnosis: diagnosis.trim() || undefined,
        symptoms: symptoms.trim() || undefined,
        temperature: temperature ? parseFloat(temperature) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        veterinarianName: veterinarianName.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to record clinical examination."
      );
    }
  };

  const handleTreatmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCow && !cowSearch.trim()) {
      setError("Please specify a cow tag or select an animal.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("Treatment end date cannot be earlier than start date.");
      return;
    }

    try {
      await createTreatmentMutation.mutateAsync({
        cowId: selectedCow?.id,
        cowTagNumber: selectedCow ? undefined : cowSearch.trim(),
        treatmentDate,
        diagnosis: diagnosis.trim(),
        treatmentType: treatmentType.trim(),
        medication: medication.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim() || undefined,
        route: route.trim() || undefined,
        startDate,
        endDate,
        withdrawalDays: Number(withdrawalDays) || 0,
        veterinarianName: veterinarianName.trim() || undefined,
        instructions: instructions.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to prescribe veterinary treatment."
      );
    }
  };

  const isSubmitting =
    createHealthRecordMutation.isPending || createTreatmentMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between p-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#1E3A2F]" />
            <div>
              <h3 className="text-sm font-bold text-[#1E3A2F] font-headline">
                Veterinary Medical Entry
              </h3>
              <p className="text-[11px] text-[#717973]">
                Clinical exams, diagnoses, and medical prescriptions
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

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E2E5DF] bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("EXAM")}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === "EXAM"
                ? "border-[#1E3A2F] text-[#1E3A2F] bg-emerald-50/20"
                : "border-transparent text-[#717973] hover:text-[#1F2421]"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Examination</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("TREATMENT")}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === "TREATMENT"
                ? "border-[#1E3A2F] text-[#1E3A2F] bg-emerald-50/20"
                : "border-transparent text-[#717973] hover:text-[#1F2421]"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Prescribe Treatment &amp; Rx</span>
          </button>
        </div>

        {/* Shared Cow Selector */}
        <div className="p-4 pb-0 text-xs">
          {error && (
            <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <label className="block font-medium text-[#1F2421] mb-1">
              Select Animal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cowSearch}
              onChange={(e) => handleSearchCows(e.target.value)}
              placeholder="Search tag number (e.g. COW-042) or name..."
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
                      {c.healthStatus} • {c.lifecycleStatus}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeTab === "EXAM" ? (
          /* FORM 1: CLINICAL EXAMINATION */
          <form onSubmit={handleExamSubmit} className="p-4 pt-3 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Examination Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Health Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value as CowHealthStatus)}
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                >
                  <option value="HEALTHY">HEALTHY</option>
                  <option value="OBSERVATION">OBSERVATION</option>
                  <option value="UNDER_TREATMENT">UNDER_TREATMENT</option>
                  <option value="RECOVERING">RECOVERING</option>
                  <option value="QUARANTINED">QUARANTINED</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1F2421] mb-1">
                Diagnosis / Chief Complaint
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Subclinical Mastitis, Ketosis, Digital Dermatitis"
                className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1F2421] mb-1">
                Observed Symptoms / Physical Findings
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
                placeholder="e.g. Swollen rear right quarter, elevated milk conductivity (+35%), lethargy"
                className="w-full p-2 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="38.5"
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="610"
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Attending Vet
                </label>
                <input
                  type="text"
                  value={veterinarianName}
                  onChange={(e) => setVeterinarianName(e.target.value)}
                  placeholder="Dr. Evans, DVM"
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1F2421] mb-1">
                Examination Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Additional veterinary observations or laboratory test samples collected..."
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
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#1E3A2F] text-white hover:bg-[#1b4332] rounded font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Examination</span>
              </button>
            </div>
          </form>
        ) : (
          /* FORM 2: PRESCRIBE TREATMENT */
          <form onSubmit={handleTreatmentSubmit} className="p-4 pt-3 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Mastitis RR"
                  required
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Treatment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={treatmentType}
                  onChange={(e) => setTreatmentType(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                >
                  <option value="Antibiotic">Antibiotic (Rx)</option>
                  <option value="Anti-inflammatory">Anti-inflammatory (NSAID)</option>
                  <option value="Vaccine">Vaccine / Preventative</option>
                  <option value="Supportive">Supportive Therapy / Fluids</option>
                  <option value="Topical">Topical / Footbath</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-medium text-[#1F2421] mb-1">
                  Medication Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  placeholder="e.g. Spectramast LC (Ceftiofur)"
                  required
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Dosage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="10ml"
                  required
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                >
                  <option value="Once Daily">Once Daily (q24h)</option>
                  <option value="Twice Daily">Twice Daily (q12h)</option>
                  <option value="Single Dose">Single Dose</option>
                  <option value="Every 48 Hours">Every 48 Hours</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Route
                </label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                >
                  <option value="Intramammary">Intramammary (IMM)</option>
                  <option value="Intramuscular">Intramuscular (IM)</option>
                  <option value="Subcutaneous">Subcutaneous (SubQ)</option>
                  <option value="Oral">Oral</option>
                  <option value="Topical">Topical</option>
                  <option value="Intravenous">Intravenous (IV)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
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

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1F2421] mb-1">
                  Withdrawal (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={withdrawalDays}
                  onChange={(e) => setWithdrawalDays(parseInt(e.target.value) || 0)}
                  className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>
            </div>

            {withdrawalDays > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Milk lockout will be enforced until{" "}
                  <strong>{withdrawalDays} days</strong> after final treatment dose.
                </span>
              </div>
            )}

            <div>
              <label className="block font-medium text-[#1F2421] mb-1">
                Administered By / Veterinarian
              </label>
              <input
                type="text"
                value={veterinarianName}
                onChange={(e) => setVeterinarianName(e.target.value)}
                placeholder="Dr. Evans, DVM"
                className="w-full h-8 px-2.5 bg-white border border-[#E2E5DF] rounded text-xs focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1F2421] mb-1">
                Special Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="e.g. Infuse immediately following complete milkout. Do not massage teat."
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
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#1E3A2F] text-white hover:bg-[#1b4332] rounded font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Prescribe Treatment</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
