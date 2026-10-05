"use client";

import React, { useState } from "react";
import {
  Flame,
  Dna,
  Heart,
  Sparkles,
  Plus,
  CalendarCheck,
} from "lucide-react";
import {
  BreedingKpiSummary,
  HeatDetectionTable,
  BreedingRecordsTable,
  PregnancyMonitoringTable,
  CalvingLogTable,
  RecordHeatModal,
  RecordBreedingModal,
  ConfirmPregnancyModal,
  RecordCalvingModal,
} from "@/features/breeding";
import { HeatRecord, BreedingRecord, PregnancyRecord } from "@/types/breeding";

export default function BreedingPage() {
  const [activeTab, setActiveTab] = useState<"PREGNANCY" | "BREEDING" | "HEAT" | "CALVING">("PREGNANCY");

  // Modal open states
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [breedingModalOpen, setBreedingModalOpen] = useState(false);
  const [pregnancyModalOpen, setPregnancyModalOpen] = useState(false);
  const [calvingModalOpen, setCalvingModalOpen] = useState(false);

  // Selected item states for cross-modal workflows
  const [selectedHeatForBreeding, setSelectedHeatForBreeding] = useState<HeatRecord | null>(null);
  const [selectedBreedingForPregnancy, setSelectedBreedingForPregnancy] = useState<BreedingRecord | null>(null);
  const [selectedPregnancyForCalving, setSelectedPregnancyForCalving] = useState<PregnancyRecord | null>(null);

  const handleInseminateFromHeat = (heat: HeatRecord) => {
    setSelectedHeatForBreeding(heat);
    setBreedingModalOpen(true);
  };

  const handleConfirmFromBreeding = (breeding: BreedingRecord) => {
    setSelectedBreedingForPregnancy(breeding);
    setPregnancyModalOpen(true);
  };

  const handleCalveFromPregnancy = (pregnancy: PregnancyRecord) => {
    setSelectedPregnancyForCalving(pregnancy);
    setCalvingModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F6] p-6 space-y-5">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E5DF] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#717973] uppercase tracking-wider mb-1">
            <span>DairyFlow Herd Ops</span>
            <span>•</span>
            <span className="text-[#1E3A2F]">Reproduction & Genetics</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1F2421] font-headline tracking-tight">
            Breeding & Reproduction Management
          </h1>
          <p className="text-xs text-[#717973] mt-0.5">
            Full bovine reproductive cycle: Estrus Detection → Insemination → Ultrasound Confirmation → Maternity Watch → Calving
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setSelectedHeatForBreeding(null);
              setHeatModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Record Heat</span>
          </button>

          <button
            onClick={() => {
              setSelectedHeatForBreeding(null);
              setBreedingModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#E8F0EC] text-[#1E3A2F] border border-[#1E3A2F]/20 text-xs font-semibold rounded-lg hover:bg-[#d8e6df] transition-colors"
          >
            <Dna className="w-3.5 h-3.5 text-[#1E3A2F]" />
            <span>Record Insemination</span>
          </button>

          <button
            onClick={() => {
              setSelectedBreedingForPregnancy(null);
              setPregnancyModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-pink-50 text-pink-700 border border-pink-200 text-xs font-semibold rounded-lg hover:bg-pink-100 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-pink-600" />
            <span>Confirm Pregnancy</span>
          </button>

          <button
            onClick={() => {
              setSelectedPregnancyForCalving(null);
              setCalvingModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#162e25] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Record Calving</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Banner */}
      <BreedingKpiSummary
        onRecordHeat={() => {
          setSelectedHeatForBreeding(null);
          setHeatModalOpen(true);
        }}
        onRecordBreeding={() => {
          setSelectedHeatForBreeding(null);
          setBreedingModalOpen(true);
        }}
        onConfirmPregnancy={() => {
          setSelectedBreedingForPregnancy(null);
          setPregnancyModalOpen(true);
        }}
        onRecordCalving={() => {
          setSelectedPregnancyForCalving(null);
          setCalvingModalOpen(true);
        }}
      />

      {/* Operations Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E5DF] bg-white px-3 pt-2 rounded-t-xl">
        <button
          onClick={() => setActiveTab("PREGNANCY")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "PREGNANCY"
              ? "border-[#1E3A2F] text-[#1E3A2F] font-bold"
              : "border-transparent text-[#717973] hover:text-[#1F2421]"
          }`}
        >
          <Heart className="w-4 h-4 text-pink-500" />
          <span>Pregnancy & Gestation Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab("BREEDING")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "BREEDING"
              ? "border-[#1E3A2F] text-[#1E3A2F] font-bold"
              : "border-transparent text-[#717973] hover:text-[#1F2421]"
          }`}
        >
          <Dna className="w-4 h-4 text-[#1E3A2F]" />
          <span>Insemination & Breeding Register</span>
        </button>

        <button
          onClick={() => setActiveTab("HEAT")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "HEAT"
              ? "border-[#1E3A2F] text-[#1E3A2F] font-bold"
              : "border-transparent text-[#717973] hover:text-[#1F2421]"
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Heat Cycle Detection Log</span>
        </button>

        <button
          onClick={() => setActiveTab("CALVING")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "CALVING"
              ? "border-[#1E3A2F] text-[#1E3A2F] font-bold"
              : "border-transparent text-[#717973] hover:text-[#1F2421]"
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Calving & Birth Log</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="space-y-4">
        {activeTab === "PREGNANCY" && (
          <PregnancyMonitoringTable
            onNewPregnancyCheck={() => {
              setSelectedBreedingForPregnancy(null);
              setPregnancyModalOpen(true);
            }}
            onRecordCalving={handleCalveFromPregnancy}
          />
        )}

        {activeTab === "BREEDING" && (
          <BreedingRecordsTable
            onNewBreeding={() => {
              setSelectedHeatForBreeding(null);
              setBreedingModalOpen(true);
            }}
            onConfirmPregnancy={handleConfirmFromBreeding}
          />
        )}

        {activeTab === "HEAT" && (
          <HeatDetectionTable
            onNewObservation={() => {
              setSelectedHeatForBreeding(null);
              setHeatModalOpen(true);
            }}
            onInseminate={handleInseminateFromHeat}
          />
        )}

        {activeTab === "CALVING" && (
          <CalvingLogTable
            onNewCalving={() => {
              setSelectedPregnancyForCalving(null);
              setCalvingModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <RecordHeatModal
        isOpen={heatModalOpen}
        onClose={() => setHeatModalOpen(false)}
      />

      <RecordBreedingModal
        isOpen={breedingModalOpen}
        onClose={() => {
          setBreedingModalOpen(false);
          setSelectedHeatForBreeding(null);
        }}
        defaultCowId={selectedHeatForBreeding?.cowId}
        defaultCowTag={selectedHeatForBreeding?.cowTagNumber}
        defaultHeatRecordId={selectedHeatForBreeding?.id}
      />

      <ConfirmPregnancyModal
        isOpen={pregnancyModalOpen}
        onClose={() => {
          setPregnancyModalOpen(false);
          setSelectedBreedingForPregnancy(null);
        }}
        defaultCowId={selectedBreedingForPregnancy?.cowId}
        defaultCowTag={selectedBreedingForPregnancy?.cowTagNumber}
        defaultBreedingId={selectedBreedingForPregnancy?.id}
        defaultBreedingDate={selectedBreedingForPregnancy?.breedingDate}
      />

      <RecordCalvingModal
        isOpen={calvingModalOpen}
        onClose={() => {
          setCalvingModalOpen(false);
          setSelectedPregnancyForCalving(null);
        }}
        defaultCowId={selectedPregnancyForCalving?.cowId}
        defaultCowTag={selectedPregnancyForCalving?.cowTagNumber}
        defaultPregnancyId={selectedPregnancyForCalving?.id}
      />
    </div>
  );
}
