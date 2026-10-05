"use client";

import React, { useState } from "react";
import {
  X,
  Award,
  Wheat,
  Stethoscope,
  TrendingUp,
  CheckCircle2,
  Activity,
  Droplets,
  Calendar,
  Syringe,
  Dna,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  FlaskConical,
} from "lucide-react";
import { StitchCow } from "../types/stitch-cow";
import { useCow } from "../hooks/use-cows";

interface CowProfileModalProps {
  cow: StitchCow | null;
  isOpen: boolean;
  onClose: () => void;
  onLogVetCheck?: (cow: StitchCow) => void;
}

export function CowProfileModal({ cow, isOpen, onClose, onLogVetCheck }: CowProfileModalProps) {
  const [activeTab, setActiveTab] = useState<string>("Overview");

  // Fetch live cow details from backend API
  const { data: liveCowResponse } = useCow(isOpen && cow ? cow.id : undefined);
  const liveCow = liveCowResponse?.data || cow?.rawCow;

  if (!isOpen || !cow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#F8F9F6] w-full max-w-6xl rounded-2xl shadow-2xl border border-[#E2E5DF] overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[#E2E5DF]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#717973]">
            <span>Herd Management</span>
            <span>/</span>
            <span>Cow Directory</span>
            <span>/</span>
            <span className="font-bold text-[#1E3A2F] bg-[#c1ecd4] px-2 py-0.5 rounded">
              {cow.tagNumber} - {cow.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-8 px-3 bg-white border border-[#E2E5DF] hover:border-[#717973] text-[#1F2421] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#1E3A2F]" />
              <span className="hidden sm:inline">Pedigree Certificate</span>
            </button>
            <button
              type="button"
              className="h-8 px-3 bg-white border border-[#E2E5DF] hover:border-[#717973] text-[#1F2421] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Wheat className="w-3.5 h-3.5 text-[#1E3A2F]" />
              <span className="hidden sm:inline">Update Ration</span>
            </button>
            <button
              type="button"
              onClick={() => onLogVetCheck?.(cow)}
              className="h-8 px-3 bg-[#1E3A2F] text-white hover:bg-[#1b4332] text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Log Vet Check</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#717973] hover:text-[#1F2421] hover:bg-[#F4F6F2] transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Animal Summary Banner Card */}
          <section className="bg-white border border-[#E2E5DF] rounded-xl p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Identity Info with Photo */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#E2E5DF] flex-shrink-0 bg-[#F4F6F2]">
                  <img
                    src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80"
                    alt={`${cow.name} portrait`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-[#1E3A2F] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    {cow.tagNumber}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl font-bold text-[#1E3A2F] tracking-tight font-headline">
                      {cow.name}
                    </h1>
                    <span className="bg-[#F0FDF4] text-[#15803D] border border-[#86EFAC] text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                      In Milk - High Producer
                    </span>
                    <span className="bg-[#F4F6F2] text-[#414844] border border-[#E2E5DF] text-xs font-semibold px-2 py-0.5 rounded">
                      {cow.currentPen}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#414844] flex-wrap">
                    <span>
                      <strong>Breed:</strong> {cow.breed}
                    </span>
                    <span className="text-[#E2E5DF]">•</span>
                    <span>
                      <strong>Parity:</strong> {cow.parity}
                    </span>
                    <span className="text-[#E2E5DF]">•</span>
                    <span>
                      <strong>DIM (Days in Milk):</strong> {cow.dim ?? "--"}
                    </span>
                    <span className="text-[#E2E5DF]">•</span>
                    <span>
                      <strong>DOB:</strong> {liveCow?.dateOfBirth ?? "Mar 14, 2021"} ({liveCow?.age || cow.age})
                    </span>
                  </div>

                  <div className="text-[11px] text-[#717973] flex items-center gap-2 mt-0.5 flex-wrap">
                    <span>
                      Tag: <em>{liveCow?.tagNumber || cow.tagNumber}</em>
                    </span>
                    <span>|</span>
                    <span>
                      RFID: <em>{liveCow?.rfid || cow.rfid || "Not assigned"}</em>
                    </span>
                    <span>|</span>
                    <span>
                      Source: <em>{liveCow?.source || "BORN"}</em>
                    </span>
                    {liveCow?.notes && (
                      <>
                        <span>|</span>
                        <span className="truncate max-w-xs">Notes: <em>{liveCow.notes}</em></span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Telemetry Row Inside Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg flex flex-col min-w-[120px]">
                  <span className="text-[11px] font-semibold text-[#717973]">Daily Yield</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-[#1E3A2F] font-headline">41.2</span>
                    <span className="text-xs text-[#717973]">L</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#15803D] mt-1 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +2.1 L vs avg
                  </span>
                </div>

                <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg flex flex-col min-w-[120px]">
                  <span className="text-[11px] font-semibold text-[#717973]">Rumination Time</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-[#1E3A2F] font-headline">512</span>
                    <span className="text-xs text-[#717973]">min/d</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#15803D] mt-1 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Optimal digest
                  </span>
                </div>

                <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg flex flex-col min-w-[120px]">
                  <span className="text-[11px] font-semibold text-[#717973]">Condition (BCS)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-[#1E3A2F] font-headline">3.25</span>
                    <span className="text-xs text-[#717973]">/ 5.0</span>
                  </div>
                  <span className="text-[11px] text-[#717973] mt-1">Mid-lactation norm</span>
                </div>

                <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg flex flex-col min-w-[120px]">
                  <span className="text-[11px] font-semibold text-[#717973]">Activity Collar</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-[#15803D] font-headline">Normal</span>
                  </div>
                  <span className="text-[11px] text-[#717973] mt-1">Index: 104 (Steady)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Sub-Navigation Tabs */}
          <nav className="flex items-center gap-1 border-b border-[#E2E5DF] bg-white px-2 rounded-t-lg">
            {[
              { id: "Overview", label: "Overview & Production", icon: Activity },
              { id: "Milk", label: "Milk Production", icon: Droplets },
              { id: "Health", label: "Health & Vet", icon: Stethoscope },
              { id: "Vaccination", label: "Vaccination", icon: Syringe },
              { id: "Breeding", label: "Breeding & Genetics", icon: Dna },
              { id: "Feed", label: "Feed & Ration", icon: Wheat },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 transition-colors border-b-2 ${
                    isActive
                      ? "border-[#1E3A2F] text-[#1E3A2F] font-bold"
                      : "border-transparent text-[#717973] hover:text-[#1F2421]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bento Grid Detailed View */}
          <div className="grid grid-cols-12 gap-4 pb-2">
            {activeTab !== "Overview" && (
              <div className="col-span-12 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>
                    <strong>{activeTab} Module Boundary:</strong> Live session logs and automated sensors for animal <strong>{cow.tagNumber}</strong> will connect in Phase 5 ({activeTab} module integration).
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded">
                  Future Module
                </span>
              </div>
            )}

            {/* Module 1: Lactation Curve Chart (8 Cols) */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-[#E2E5DF] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-[#1E3A2F] font-headline">
                      Lactation Production Curve (305-Day Projection)
                    </h2>
                    <p className="text-xs text-[#717973]">
                      Comparing Current Parity 3 against Pen Average and Parity 2 Historical Curve
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-[#414844]">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-1 bg-[#1E3A2F] rounded" /> Current Parity 3
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-1 bg-[#86EFAC] rounded" /> Lactation 2
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-1 border-t-2 border-dashed border-[#717973] rounded" /> Herd Avg
                    </span>
                  </div>
                </div>

                {/* Inset Chart Area with SVG */}
                <div className="h-60 w-full bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg p-4 relative flex flex-col justify-end">
                  {/* Y-Axis Grid Lines */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none text-[10px] text-[#717973]">
                    <div className="border-b border-[#E2E5DF] w-full flex justify-between">
                      <span>50 L</span>
                    </div>
                    <div className="border-b border-[#E2E5DF] w-full flex justify-between">
                      <span>40 L</span>
                    </div>
                    <div className="border-b border-[#E2E5DF] w-full flex justify-between">
                      <span>30 L</span>
                    </div>
                    <div className="border-b border-[#E2E5DF] w-full flex justify-between">
                      <span>20 L</span>
                    </div>
                    <div className="border-b border-[#E2E5DF] w-full flex justify-between">
                      <span>10 L</span>
                    </div>
                  </div>

                  {/* SVG Lactation Curves Rendering */}
                  <svg
                    className="w-full h-full relative z-10 overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 600 200"
                  >
                    {/* Herd Average Baseline (Dashed) */}
                    <path
                      d="M 0 140 Q 90 60 180 85 T 380 120 T 600 160"
                      fill="none"
                      stroke="#717973"
                      strokeDasharray="4 4"
                      strokeWidth="2"
                    />
                    {/* Lactation 2 Historical */}
                    <path
                      d="M 0 130 Q 80 50 160 70 T 360 110 T 600 150"
                      fill="none"
                      stroke="#86EFAC"
                      strokeWidth="2.5"
                    />
                    {/* Current Lactation 3 Solid Trend */}
                    <path
                      d="M 0 110 Q 70 30 150 45 T 236 70"
                      fill="none"
                      stroke="#1E3A2F"
                      strokeWidth="3.5"
                    />
                    {/* Current DIM indicator dot at DIM 118 */}
                    <circle cx="236" cy="70" r="5" fill="#1E3A2F" stroke="#FFFFFF" strokeWidth="2" />
                    {/* Projected path */}
                    <path
                      d="M 236 70 Q 320 85 420 115 T 600 145"
                      fill="none"
                      opacity="0.6"
                      stroke="#1E3A2F"
                      strokeDasharray="3 3"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* X-Axis Labels */}
                  <div className="flex justify-between text-[11px] text-[#717973] pt-2 border-t border-[#E2E5DF] z-10">
                    <span>DIM 0 (Calving)</span>
                    <span>DIM 50 (Peak)</span>
                    <span className="font-bold text-[#1E3A2F]">DIM 118 (Today)</span>
                    <span>DIM 200</span>
                    <span>DIM 250</span>
                    <span>DIM 305 (Dry-off)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#E2E5DF] text-center">
                <div>
                  <span className="text-[11px] text-[#717973]">Peak Yield (DIM 44)</span>
                  <p className="text-sm font-bold text-[#1E3A2F]">47.8 L/day</p>
                </div>
                <div>
                  <span className="text-[11px] text-[#717973]">Projected 305-day</span>
                  <p className="text-sm font-bold text-[#1E3A2F]">11,420 kg</p>
                </div>
                <div>
                  <span className="text-[11px] text-[#717973]">Persistency Index</span>
                  <p className="text-sm font-bold text-[#15803D]">94.2%</p>
                </div>
              </div>
            </div>

            {/* Module 2: Milking Parlor Breakdown (4 Cols) */}
            <div className="col-span-12 lg:col-span-4 bg-white border border-[#E2E5DF] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
                  <div>
                    <h2 className="text-sm font-bold text-[#1E3A2F] font-headline">
                      Parlor Telemetry
                    </h2>
                    <p className="text-xs text-[#717973]">Today's Automated Milking Sessions</p>
                  </div>
                  <Droplets className="w-4 h-4 text-[#1E3A2F]" />
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  {/* AM Session */}
                  <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-[#1E3A2F]">AM Milking Session</span>
                      </div>
                      <span className="text-[11px] text-[#717973]">05:45 AM</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="text-xs text-[#717973]">Yield Harvested</span>
                        <p className="text-base font-bold text-[#1E3A2F]">21.4 L</p>
                      </div>
                      <div>
                        <span className="text-xs text-[#717973]">Conductivity</span>
                        <p className="text-base font-bold text-[#15803D]">5.1 mS/cm</p>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-[#15803D] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Normal flow rate (4.2 L/min)
                    </div>
                  </div>

                  {/* PM Session */}
                  <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-bold text-[#1E3A2F]">PM Milking Session</span>
                      </div>
                      <span className="text-[11px] text-[#717973]">16:30 PM</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="text-xs text-[#717973]">Yield Harvested</span>
                        <p className="text-base font-bold text-[#1E3A2F]">19.8 L</p>
                      </div>
                      <div>
                        <span className="text-xs text-[#717973]">Conductivity</span>
                        <p className="text-base font-bold text-[#15803D]">5.2 mS/cm</p>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-[#15803D] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete milkout, clean
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Daily Parlor Aggregate */}
              <div className="p-3 bg-[#EAECE7] border border-[#E2E5DF] rounded-lg flex items-center justify-between mt-3">
                <span className="text-xs font-bold text-[#1E3A2F]">Total Daily Parlor Intake:</span>
                <span className="text-base font-bold text-[#1E3A2F] font-headline">41.2 L</span>
              </div>
            </div>

            {/* Module 3: Milk Quality Breakdown Card (4 Cols) */}
            <div className="col-span-12 md:col-span-4 bg-white border border-[#E2E5DF] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
                  <div>
                    <h2 className="text-sm font-bold text-[#1E3A2F] font-headline">
                      Milk Quality &amp; Solids
                    </h2>
                    <p className="text-xs text-[#717973]">Lab analysis from inline sampler</p>
                  </div>
                  <FlaskConical className="w-4 h-4 text-[#006c48]" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg">
                    <span className="text-[11px] font-semibold text-[#717973]">Butterfat</span>
                    <p className="text-base font-bold text-[#1E3A2F] mt-1">4.02%</p>
                    <span className="text-[11px] text-[#15803D]">Target: &gt; 3.85%</span>
                  </div>

                  <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg">
                    <span className="text-[11px] font-semibold text-[#717973]">Crude Protein</span>
                    <p className="text-base font-bold text-[#1E3A2F] mt-1">3.41%</p>
                    <span className="text-[11px] text-[#15803D]">Target: &gt; 3.20%</span>
                  </div>

                  <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg">
                    <span className="text-[11px] font-semibold text-[#717973]">Lactose</span>
                    <p className="text-base font-bold text-[#1E3A2F] mt-1">4.88%</p>
                    <span className="text-[11px] text-[#717973]">Normal range</span>
                  </div>

                  <div className="p-3 bg-[#F8F9F6] border border-[#E2E5DF] rounded-lg">
                    <span className="text-[11px] font-semibold text-[#717973]">Somatic Cells</span>
                    <p className="text-base font-bold text-[#15803D] mt-1">65k</p>
                    <span className="text-[11px] text-[#15803D]">Grade A (&lt;100k)</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#F0FDF4] border border-[#86EFAC] rounded-lg mt-4 flex items-center gap-2 text-xs text-[#15803D]">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Zero sub-clinical mastitis flag. Fat/Protein Ratio: <strong>1.18</strong> (Optimal).</span>
              </div>
            </div>

            {/* Module 4: Recent Health & Breeding Timeline (4 Cols) */}
            <div className="col-span-12 md:col-span-4 bg-white border border-[#E2E5DF] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
                  <div>
                    <h2 className="text-sm font-bold text-[#1E3A2F] font-headline">
                      Reproduction &amp; Health
                    </h2>
                    <p className="text-xs text-[#717973]">Breeding cycle and milestone history</p>
                  </div>
                  <Calendar className="w-4 h-4 text-[#1E3A2F]" />
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-5 border-l-2 border-[#E2E5DF] flex flex-col gap-4 mt-4 ml-2">
                  <div className="relative">
                    <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#B45309] border-2 border-white" />
                    <span className="text-[11px] font-bold text-[#B45309]">Feb 04, 2025</span>
                    <h3 className="text-xs font-bold text-[#1F2421]">Artificial Insemination (AI)</h3>
                    <p className="text-xs text-[#717973]">Sire: STgen Legend-ET. Tech M. Alvarez.</p>
                    <span className="inline-block mt-1 bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] text-[10px] font-semibold px-2 py-0.5 rounded">
                      Preg Check Due in 25d
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#006c48] border-2 border-white" />
                    <span className="text-[11px] font-semibold text-[#717973]">Jan 18, 2025</span>
                    <h3 className="text-xs font-bold text-[#1F2421]">Routine Hoof Trimming</h3>
                    <p className="text-xs text-[#717973]">Mobility score 1 (Flawless gait).</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#1E3A2F] border-2 border-white" />
                    <span className="text-[11px] font-semibold text-[#717973]">Nov 12, 2024</span>
                    <h3 className="text-xs font-bold text-[#1F2421]">Calving (Parity 3)</h3>
                    <p className="text-xs text-[#717973]">Healthy heifer calf (#1209).</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-3 h-8 border border-[#E2E5DF] hover:bg-[#F8F9F6] text-[#1E3A2F] text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Full Diagnostic Veterinary Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Module 5: Current Daily Ration Plan (4 Cols) */}
            <div className="col-span-12 md:col-span-4 bg-white border border-[#E2E5DF] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
                  <div>
                    <h2 className="text-sm font-bold text-[#1E3A2F] font-headline">
                      Current Daily Ration
                    </h2>
                    <p className="text-xs text-[#717973]">TMR High-Yield String 01 Formulation</p>
                  </div>
                  <Wheat className="w-4 h-4 text-[#15803D]" />
                </div>

                <div className="flex flex-col gap-2.5 mt-4">
                  <div className="flex items-center justify-between p-2 bg-[#F8F9F6] rounded border border-[#E2E5DF]">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1E3A2F]">Maize Corn Silage</span>
                      <span className="text-[11px] text-[#717973]">34% Dry Matter Base</span>
                    </div>
                    <span className="text-sm font-bold text-[#1E3A2F]">14.0 kg</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#F8F9F6] rounded border border-[#E2E5DF]">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1E3A2F]">Alfalfa Haylage</span>
                      <span className="text-[11px] text-[#717973]">High Crude Fiber &amp; Protein</span>
                    </div>
                    <span className="text-sm font-bold text-[#1E3A2F]">7.2 kg</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#F8F9F6] rounded border border-[#E2E5DF]">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1E3A2F]">Organic Mineral Premix</span>
                      <span className="text-[11px] text-[#717973]">Ca, P, Biotin, Yeast</span>
                    </div>
                    <span className="text-sm font-bold text-[#1E3A2F]">2.8 kg</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E5DF] flex items-center justify-between mt-3">
                <div>
                  <span className="text-[11px] text-[#717973]">Total Daily As-Fed</span>
                  <p className="text-sm font-bold text-[#1E3A2F]">24.0 kg DMI</p>
                </div>
                <span className="bg-[#F0FDF4] text-[#15803D] border border-[#86EFAC] text-xs font-semibold px-2 py-1 rounded">
                  Energy Bal: +1.4 Mcal/d
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
