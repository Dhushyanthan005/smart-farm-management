"use client";

import React, { useState } from "react";
import {
  MilkShiftHeader,
  MilkShiftKpis,
  MilkBatchTable,
  TankerDispatchCard,
  SiloManifoldCard,
  MOCK_MILK_ENTRIES,
  MOCK_SILOS,
  MOCK_TANKER_DISPATCH,
  MilkSessionEntry,
} from "@/features/milk";

export default function MilkPage() {
  const [silos, setSilos] = useState(MOCK_SILOS);
  const [tankerDispatch, setTankerDispatch] = useState(MOCK_TANKER_DISPATCH);

  const handleShiftChange = (shift: "Morning" | "Evening") => {
    // Shift context changed
  };

  const handleCalibrate = () => {
    alert("Parlor flow meters and conductivity sensors are calibrated (Last sync: 14s ago).");
  };

  const handleSwitchTank = () => {
    alert("Target silo switched to Tank 01 for balancing volume headroom.");
  };

  const handleCommitEntries = (entries: MilkSessionEntry[]) => {
    const totalYield = entries.reduce((acc, curr) => acc + curr.amYield, 0);
    const bulkYield = entries
      .filter((e) => e.status === "bulk")
      .reduce((acc, curr) => acc + curr.amYield, 0);
    alert(
      `Shift Committed Successfully!\nTotal Yield: ${totalYield.toFixed(1)} L\nBulk Assigned: ${bulkYield.toFixed(1)} L\nWithheld: ${(totalYield - bulkYield).toFixed(1)} L`
    );
  };

  const handleImportTelemetry = () => {
    alert("Importing automated telemetry from DeLaval & GEA rotary parlor stanchions... Done!");
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
      {/* Operational Banner: Shift Parameters & Herdsman Scope */}
      <MilkShiftHeader onShiftChange={handleShiftChange} onCalibrate={handleCalibrate} />

      {/* Section 1: Shift Summary & Bulk Tank Allocation KPIs */}
      <MilkShiftKpis onSwitchTank={handleSwitchTank} />

      {/* Main Split: Batch Milking Table (8 Cols) & Tanker Dispatch (4 Cols) */}
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Left (8 Cols): Fast Batch Milking Entry Table */}
        <div className="col-span-12 xl:col-span-8">
          <MilkBatchTable
            initialEntries={MOCK_MILK_ENTRIES}
            onCommit={handleCommitEntries}
            onImportTelemetry={handleImportTelemetry}
          />
        </div>

        {/* Right (4 Cols): Outbound Logistics & Bulk Silo Farm Manifold */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <TankerDispatchCard dispatch={tankerDispatch} onGenerateBol={handleGenerateBol} />
          <SiloManifoldCard silos={silos} />
        </div>
      </div>
    </div>
  );
}
