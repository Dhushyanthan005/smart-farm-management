"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CowStatsBanner,
  CowFilterToolbar,
  CowTable,
  CowTelemetryFooter,
  CowProfileModal,
  CowFormModal,
  MOCK_STITCH_COWS,
  StitchCow,
  useCows,
  useCowStats,
  cowToStitchCow,
} from "@/features/cows";
import { Cow, CowFilterParams, HealthStatus } from "@/types/cow";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function CowsPage() {
  const router = useRouter();

  // Pagination & filter state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedHealth, setSelectedHealth] = useState("All");
  const [selectedBarn, setSelectedBarn] = useState("All");
  const [selectedParity, setSelectedParity] = useState("All");

  // Profile and Form modal states
  const [activeProfileCow, setActiveProfileCow] = useState<StitchCow | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cowToEdit, setCowToEdit] = useState<Cow | null>(null);

  // Map UI filter selections to backend API filter params
  const apiFilterParams = useMemo<CowFilterParams>(() => {
    const params: CowFilterParams = {
      page,
      size: pageSize,
      sort: "createdAt,desc",
    };

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (selectedHealth !== "All") {
      if (selectedHealth === "Healthy") params.healthStatus = "HEALTHY" as HealthStatus;
      else if (selectedHealth === "Observation") params.healthStatus = "UNDER_TREATMENT" as HealthStatus;
      else if (selectedHealth === "Quarantined") params.healthStatus = "QUARANTINED" as HealthStatus;
    }

    if (selectedStage !== "All") {
      params.stage = selectedStage;
    }

    if (selectedBarn !== "All") {
      params.barn = selectedBarn;
    }

    if (selectedParity !== "All") {
      if (selectedParity === "4+") {
        params.minParity = 4;
      } else {
        params.parity = Number(selectedParity);
      }
    }

    return params;
  }, [page, pageSize, searchQuery, selectedHealth, selectedStage, selectedBarn, selectedParity]);

  // Real TanStack Query hooks
  const {
    data: cowsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useCows(apiFilterParams);

  const { data: statsResponse } = useCowStats();

  // Convert real API cows to Stitch UI format; fallback to mock data only if API fails with error
  const { displayedCows, totalElements, totalPages } = useMemo(() => {
    if (cowsResponse?.data) {
      const pageData = cowsResponse.data;
      const stitchCows = (pageData.content || []).map(cowToStitchCow);
      return {
        displayedCows: stitchCows,
        totalElements: pageData.totalElements ?? stitchCows.length,
        totalPages: pageData.totalPages ?? 1,
      };
    }

    // If query failed with error, provide fallback fixtures for demonstration continuity
    if (isError) {
      return {
        displayedCows: MOCK_STITCH_COWS,
        totalElements: MOCK_STITCH_COWS.length,
        totalPages: 1,
      };
    }

    return {
      displayedCows: [],
      totalElements: 0,
      totalPages: 1,
    };
  }, [cowsResponse, isError]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStage("All");
    setSelectedHealth("All");
    setSelectedBarn("All");
    setSelectedParity("All");
    setPage(0);
  };

  const handleViewProfile = (cow: StitchCow) => {
    setActiveProfileCow(cow);
    setIsProfileOpen(true);
  };

  const handleRegisterCow = () => {
    setCowToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditCow = (cow: StitchCow) => {
    if (cow.rawCow) {
      setCowToEdit(cow.rawCow);
    } else {
      // Map stitch cow fields to partial cow
      setCowToEdit({
        id: cow.id,
        tagNumber: cow.tagNumber.replace("#", ""),
        name: cow.name,
        breed: "HOLSTEIN_FRIESIAN",
        gender: "FEMALE",
        dateOfBirth: new Date().toISOString().split("T")[0],
        parity: cow.parity,
        healthStatus: "HEALTHY",
        lifecycleStatus: "ACTIVE",
        source: "BORN",
        expectedMilkCapacity: cow.todayYield,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setIsFormOpen(true);
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
    const headers = "Tag,Name,RFID,Breed,Age,Parity,DIM,Yield,SCC,ReproStatus,Pen,Health\n";
    const rows = displayedCows
      .map(
        (c) =>
          `"${c.tagNumber}","${c.name}","${c.rfid}","${c.breed}","${c.age}",${c.parity},"${c.dim ?? ""}",${c.todayYield ?? ""},"${c.sccValue}","${c.reproStatus}","${c.currentPen}","${c.healthStatus}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `dairyflow_herd_registry_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F6]">
      {/* Subheader: Breadcrumbs, Scope, Batch Actions & Live Counter */}
      <CowStatsBanner
        stats={statsResponse?.data}
        onBulkInsemination={() => router.push("/breeding")}
        onMovePen={() => alert("Select animals in table and choose destination pen.")}
        onExportCsv={handleExportCsv}
        onRegisterCow={handleRegisterCow}
      />

      {/* Quick Search and Filter Strip */}
      <CowFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(0);
        }}
        selectedStage={selectedStage}
        onStageChange={(stage) => {
          setSelectedStage(stage);
          setPage(0);
        }}
        selectedHealth={selectedHealth}
        onHealthChange={(health) => {
          setSelectedHealth(health);
          setPage(0);
        }}
        selectedBarn={selectedBarn}
        onBarnChange={(barn) => {
          setSelectedBarn(barn);
          setPage(0);
        }}
        selectedParity={selectedParity}
        onParityChange={(parity) => {
          setSelectedParity(parity);
          setPage(0);
        }}
        onReset={handleResetFilters}
      />

      {/* API Error Alert Notification */}
      {isError && (
        <div className="mx-6 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Could not synchronize live livestock registry with backend: {error?.message || "Server unreachable"}. Showing demonstration data.
            </span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1 font-semibold text-amber-900 hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Table Canvas & Telemetry Area */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-4">
        {/* Data Matrix with Server Pagination & State */}
        <CowTable
          cows={displayedCows}
          isLoading={isLoading}
          totalCount={totalElements}
          currentPage={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          onViewProfile={handleViewProfile}
          onEditCow={handleEditCow}
          onRegisterCow={handleRegisterCow}
          onAddHealthNote={handleAddHealthNote}
          onLogMilk={handleLogMilk}
          onBreedCow={handleBreedCow}
        />

        {/* Quick Triage Bottom Telemetry Strip */}
        <CowTelemetryFooter onReviewEstrus={() => router.push("/breeding")} />
      </div>

      {/* Cow Profile Modal (Stitch Screen: Aurora #1042) */}
      <CowProfileModal
        cow={activeProfileCow}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogVetCheck={(cow) => router.push(`/health?cow=${encodeURIComponent(cow.tagNumber)}`)}
      />

      {/* Add / Edit Cow Modal */}
      <CowFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setCowToEdit(null);
        }}
        cowToEdit={cowToEdit}
      />
    </div>
  );
}
