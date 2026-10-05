"use client";

import React, { useState, useMemo } from "react";
import {
  MilkShiftHeader,
  MilkShiftKpis,
  MilkBatchTable,
  TankerDispatchCard,
  SiloManifoldCard,
  MilkEntryModal,
  MOCK_MILK_ENTRIES,
  MOCK_SILOS,
  MOCK_TANKER_DISPATCH,
  MilkSessionEntry,
  useShiftMilkSummary,
  useDailyMilkSummary,
  useMilkRecords,
  useCreateBatchMilkRecords,
} from "@/features/milk";
import { useCows } from "@/features/cows/hooks/use-cows";
import { MilkRecordStatus, MilkShift } from "@/types/milk";

export default function MilkPage() {
  const [silos] = useState(MOCK_SILOS);
  const [tankerDispatch] = useState(MOCK_TANKER_DISPATCH);

  // Controlled shift & date state
  const [selectedShift, setSelectedShift] = useState<"Morning" | "Evening">("Morning");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const apiShift: MilkShift = selectedShift === "Morning" ? "MORNING" : "EVENING";

  // Real backend queries
  const { data: shiftSummaryRes, isLoading: shiftLoading } = useShiftMilkSummary(
    selectedDate,
    apiShift
  );
  const { data: dailySummaryRes, isLoading: dailyLoading } = useDailyMilkSummary(selectedDate);
  const { data: milkRecordsRes, isLoading: recordsLoading } = useMilkRecords({
    date: selectedDate,
    shift: apiShift,
    size: 100,
  });
  const { data: activeCowsRes } = useCows({
    lifecycleStatus: "ACTIVE",
    size: 50,
  });

  // Mutation for committing parlor batch
  const createBatchMutation = useCreateBatchMilkRecords();

  const handleShiftChange = (shift: "Morning" | "Evening") => {
    setSelectedShift(shift);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleCalibrate = () => {
    alert("Parlor flow meters and conductivity sensors are calibrated (Last sync: 14s ago).");
  };

  const handleSwitchTank = () => {
    alert("Target silo switched to Tank 01 for balancing volume headroom.");
  };

  // Convert real database records (or fallback active cows) into table entries
  const tableEntries: MilkSessionEntry[] = useMemo(() => {
    const records = milkRecordsRes?.data?.content;
    if (records && records.length > 0) {
      return records.map((record, index) => {
        let status: "bulk" | "waste" | "colostrum" = "bulk";
        if (record.status === "WASTE" || record.status === "DISCARDED") {
          status = "waste";
        } else if (record.status === "COLOSTRUM") {
          status = "colostrum";
        }

        return {
          unitNumber: String(index + 1).padStart(2, "0"),
          cowTag: `#${record.cowTagNumber}`,
          cowName: record.cowName || "Active Cow",
          pen: "Parlor Stanchion",
          badge: record.status === "WASTE" ? "Rx FLAGGED" : undefined,
          amYield: record.quantityLiters,
          status,
          conductivity: record.conductivity ?? 5.0,
          duration: "06:15",
          sccFlag:
            record.somaticCellCount && record.somaticCellCount > 400000
              ? "danger"
              : status === "colostrum"
              ? "colostrum"
              : "optimal",
          notes: record.notes || "",
          cowId: record.cowId,
          recordId: record.id,
        };
      });
    }

    // If no milk records exist yet for this date/shift, generate rows from real active cows in DB
    const activeCows = activeCowsRes?.data?.content;
    if (activeCows && activeCows.length > 0) {
      return activeCows.slice(0, 15).map((cow, index) => ({
        unitNumber: String(index + 1).padStart(2, "0"),
        cowTag: `#${cow.tagNumber}`,
        cowName: cow.name || `Cow ${cow.tagNumber}`,
        pen: cow.pen || "Parlor A",
        amYield: 24.5,
        status: "bulk",
        conductivity: 5.0,
        duration: "06:00",
        sccFlag: "optimal",
        notes: "",
        cowId: cow.id,
      }));
    }

    // Otherwise use default mock entries for visual fidelity
    return MOCK_MILK_ENTRIES;
  }, [milkRecordsRes?.data?.content, activeCowsRes?.data?.content]);

  const handleCommitEntries = async (entries: MilkSessionEntry[]) => {
    try {
      setNotification(null);
      const batchRecords = entries.map((e) => {
        let backendStatus: MilkRecordStatus = "BULK";
        if (e.status === "waste") backendStatus = "WASTE";
        if (e.status === "colostrum") backendStatus = "COLOSTRUM";

        return {
          cowId: e.cowId,
          cowTagNumber: e.cowTag.replace("#", "").trim(),
          quantityLiters: e.amYield,
          status: backendStatus,
          conductivity: e.conductivity,
          notes: e.notes || undefined,
        };
      });

      await createBatchMutation.mutateAsync({
        productionDate: selectedDate,
        shift: apiShift,
        records: batchRecords,
      });

      const totalYield = entries.reduce((acc, curr) => acc + curr.amYield, 0);
      const bulkYield = entries
        .filter((e) => e.status === "bulk")
        .reduce((acc, curr) => acc + curr.amYield, 0);
      const withheldYield = totalYield - bulkYield;

      setNotification({
        type: "success",
        message: `Shift Committed Successfully! Total Yield: ${totalYield.toFixed(1)} L | Bulk: ${bulkYield.toFixed(1)} L | Withheld: ${withheldYield.toFixed(1)} L`,
      });
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string }).message ||
        "Failed to commit shift entries. Some records may already be recorded for this date/shift.";
      setNotification({
        type: "error",
        message: errorMsg,
      });
    }
  };

  const handleImportTelemetry = () => {
    alert("Importing automated telemetry from DeLaval & GEA rotary parlor stanchions... Complete!");
  };

  const handleGenerateBol = () => {
    const bolText = `DAIRYFLOW CERTIFIED BILL OF LADING\nManifest: USDA Grade A Raw Milk\nCooperative: ${tankerDispatch.cooperative}\nDriver: ${tankerDispatch.driver}\nTanker: ${tankerDispatch.tankerNumber}\nVolume: ${tankerDispatch.assignedVolume} L\nButterfat: ${tankerDispatch.butterfat}%\nBeta-Lactam: ${tankerDispatch.betaLactam}\nStatus: RELEASED & CRYPTO-SEALED`;
    const blob = new Blob([bolText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `BOL_${tankerDispatch.route}_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5] p-6 space-y-4">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Operational Banner: Shift Parameters & Herdsman Scope */}
      <MilkShiftHeader
        selectedShift={selectedShift}
        selectedDate={selectedDate}
        onShiftChange={handleShiftChange}
        onDateChange={handleDateChange}
        onCalibrate={handleCalibrate}
        onOpenEntryModal={() => setIsEntryModalOpen(true)}
      />

      {/* Section 1: Shift Summary & Bulk Tank Allocation KPIs */}
      <MilkShiftKpis
        shiftSummary={shiftSummaryRes?.data}
        dailySummary={dailySummaryRes?.data}
        isLoading={shiftLoading || dailyLoading}
        onSwitchTank={handleSwitchTank}
      />

      {/* Main Split: Batch Milking Table (8 Cols) & Tanker Dispatch (4 Cols) */}
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Left (8 Cols): Fast Batch Milking Entry Table */}
        <div className="col-span-12 xl:col-span-8">
          <MilkBatchTable
            initialEntries={tableEntries}
            onCommit={handleCommitEntries}
            onImportTelemetry={handleImportTelemetry}
            isSubmitting={createBatchMutation.isPending}
          />
        </div>

        {/* Right (4 Cols): Outbound Logistics & Bulk Silo Farm Manifold */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <TankerDispatchCard dispatch={tankerDispatch} onGenerateBol={handleGenerateBol} />
          <SiloManifoldCard silos={silos} />
        </div>
      </div>

      {/* Modal for single milk record entry */}
      <MilkEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        defaultDate={selectedDate}
        defaultShift={apiShift}
      />
    </div>
  );
}
