"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CowStatsBanner,
  CowFilterToolbar,
  CowTable,
  CowTelemetryFooter,
  CowProfileModal,
  MOCK_STITCH_COWS,
  StitchCow,
  useCows,
} from "@/features/cows";

export default function CowsPage() {
  const router = useRouter();

  // TanStack Query API connection (preserved)
  const { data: apiData, isLoading } = useCows(0, 20);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedHealth, setSelectedHealth] = useState("All");
  const [selectedBarn, setSelectedBarn] = useState("All");
  const [selectedParity, setSelectedParity] = useState("All");

  // Profile modal state
  const [activeProfileCow, setActiveProfileCow] = useState<StitchCow | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter dataset
  const filteredCows = useMemo(() => {
    return MOCK_STITCH_COWS.filter((cow) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTag = cow.tagNumber.toLowerCase().includes(q);
        const matchesName = cow.name.toLowerCase().includes(q);
        const matchesRfid = cow.rfid.toLowerCase().includes(q);
        if (!matchesTag && !matchesName && !matchesRfid) return false;
      }

      // Lactation stage
      if (selectedStage !== "All" && cow.lactationStage !== selectedStage) {
        return false;
      }

      // Health status
      if (selectedHealth !== "All" && cow.healthStatus !== selectedHealth) {
        return false;
      }

      // Barn
      if (selectedBarn !== "All" && !cow.currentPen.includes(selectedBarn)) {
        return false;
      }

      // Parity
      if (selectedParity !== "All") {
        if (selectedParity === "4+" && cow.parity < 4) return false;
        if (selectedParity !== "4+" && cow.parity.toString() !== selectedParity) return false;
      }

      return true;
    });
  }, [searchQuery, selectedStage, selectedHealth, selectedBarn, selectedParity]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStage("All");
    setSelectedHealth("All");
    setSelectedBarn("All");
    setSelectedParity("All");
  };

  const handleViewProfile = (cow: StitchCow) => {
    setActiveProfileCow(cow);
    setIsProfileOpen(true);
  };

  const handleLogMilk = (cow: StitchCow) => {
    router.push(`/milk?cow=${encodeURIComponent(cow.tagNumber)}`);
  };

  const handleAddHealthNote = (cow: StitchCow) => {
    router.push(`/health?cow=${encodeURIComponent(cow.tagNumber)}`);
  };

  const handleBreedCow = (cow: StitchCow) => {
    router.push(`/breeding?cow=${encodeURIComponent(cow.tagNumber)}`);
  };

  const handleExportCsv = () => {
    const headers = "Tag,Name,RFID,Breed,Age,Parity,DIM,Yield,SCC,ReproStatus,Pen\n";
    const rows = filteredCows
      .map(
        (c) =>
          `"${c.tagNumber}","${c.name}","${c.rfid}","${c.breed}","${c.age}",${c.parity},"${c.dim ?? ""}",${c.todayYield ?? ""},"${c.sccValue}","${c.reproStatus}","${c.currentPen}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "dairyflow_herd_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F6]">
      {/* Subheader: Breadcrumbs, Scope, Batch Actions & Counter */}
      <CowStatsBanner
        onBulkInsemination={() => router.push("/breeding")}
        onMovePen={() => alert("Select animals in table and choose destination pen.")}
        onExportCsv={handleExportCsv}
        onRegisterCow={() => alert("Open cow registration modal or navigate to create cow form.")}
      />

      {/* Quick Search and Filter Strip */}
      <CowFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStage={selectedStage}
        onStageChange={setSelectedStage}
        selectedHealth={selectedHealth}
        onHealthChange={setSelectedHealth}
        selectedBarn={selectedBarn}
        onBarnChange={setSelectedBarn}
        selectedParity={selectedParity}
        onParityChange={setSelectedParity}
        onReset={handleResetFilters}
      />

      {/* Table Canvas & Telemetry Area */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-4">
        {/* Data Matrix */}
        <CowTable
          cows={filteredCows}
          onViewProfile={handleViewProfile}
          onAddHealthNote={handleAddHealthNote}
          onLogMilk={handleLogMilk}
          onBreedCow={handleBreedCow}
        />

        {/* Quick Triage Bottom Telemetry Strip */}
        <CowTelemetryFooter onReviewEstrus={() => router.push("/breeding")} />
      </div>

      {/* Cow Profile Modal (Stitch Screen 3: Aurora #1042) */}
      <CowProfileModal
        cow={activeProfileCow}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogVetCheck={(cow) => router.push(`/health?cow=${encodeURIComponent(cow.tagNumber)}`)}
      />
    </div>
  );
}
