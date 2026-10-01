"use client";

import React, { useState } from "react";
import {
  Radio,
  Plus,
  CheckCircle2,
  Trash2,
  Package,
  AlertTriangle,
  Flag,
  UploadCloud,
  Save,
  AlertOctagon,
} from "lucide-react";
import { MilkSessionEntry, MilkStatus } from "../types/milk-log";

interface MilkBatchTableProps {
  initialEntries: MilkSessionEntry[];
  onCommit?: (entries: MilkSessionEntry[]) => void;
  onImportTelemetry?: () => void;
}

export function MilkBatchTable({
  initialEntries,
  onCommit,
  onImportTelemetry,
}: MilkBatchTableProps) {
  const [entries, setEntries] = useState<MilkSessionEntry[]>(initialEntries);
  const [filterMode, setFilterMode] = useState<"all" | "withholding" | "conductivity">("all");
  const [scannerInput, setScannerInput] = useState("");

  const handleYieldChange = (index: number, val: string) => {
    const num = parseFloat(val);
    const updated = [...entries];
    updated[index].amYield = isNaN(num) ? 0 : num;
    setEntries(updated);
  };

  const handleNotesChange = (index: number, val: string) => {
    const updated = [...entries];
    updated[index].notes = val;
    setEntries(updated);
  };

  const toggleStatus = (index: number) => {
    const updated = [...entries];
    const current = updated[index].status;
    if (current === "bulk") {
      updated[index].status = "waste";
    } else if (current === "waste") {
      updated[index].status = "colostrum";
    } else {
      updated[index].status = "bulk";
    }
    setEntries(updated);
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) return;

    const newUnit = (entries.length + 1).toString().padStart(2, "0");
    const newEntry: MilkSessionEntry = {
      unitNumber: newUnit,
      cowTag: scannerInput.startsWith("#") ? scannerInput : `#${scannerInput}`,
      cowName: "Scanned Animal",
      pen: "Pen 1",
      amYield: 25.0,
      status: "bulk",
      conductivity: 5.0,
      duration: "06:00",
      sccFlag: "normal",
      notes: "Scanned via RFID wand",
    };
    setEntries([newEntry, ...entries]);
    setScannerInput("");
  };

  const filteredEntries = entries.filter((item) => {
    if (filterMode === "withholding") return item.status === "waste" || item.status === "colostrum";
    if (filterMode === "conductivity") return item.conductivity >= 6.0;
    return true;
  });

  const totalWithheld = entries
    .filter((e) => e.status !== "bulk")
    .reduce((acc, curr) => acc + curr.amYield, 0);

  return (
    <section className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm overflow-hidden flex flex-col">
      {/* Fast Input Header & Scanner Toolbar */}
      <div className="p-3 bg-[#F8F9F6] border-b border-[#E2E5DF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2 font-headline">
            <Radio className="w-4 h-4 text-[#006c48]" />
            Batch Stanchion Milking Log
          </div>
          <span className="text-[11px] bg-[#E7EEFF] text-[#1E3A2F] px-2 py-0.5 rounded font-semibold">
            High-Speed RFID Capture
          </span>
        </div>

        {/* RFID Wand Scanner Input Box */}
        <form onSubmit={handleScanSubmit} className="flex items-center gap-2 flex-1 max-w-md ml-auto">
          <div className="relative w-full">
            <Radio className="w-4 h-4 text-[#006c48] absolute left-2.5 top-2 animate-pulse" />
            <input
              type="text"
              value={scannerInput}
              onChange={(e) => setScannerInput(e.target.value)}
              placeholder="Scan Collar / RFID or type Tag # [Enter]..."
              className="w-full h-8 pl-9 pr-14 rounded border-2 border-[#1E3A2F]/40 bg-white font-mono text-xs text-[#1E3A2F] placeholder:text-[#717973] focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#006c48] outline-none shadow-sm"
            />
            <span className="absolute right-2 top-1.5 text-[10px] font-semibold bg-[#EAECE7] text-[#414844] px-1.5 py-0.5 rounded border border-[#E2E5DF]">
              F2 SCAN
            </span>
          </div>

          <button
            type="submit"
            className="h-8 px-2.5 bg-[#1E3A2F] text-white rounded text-xs font-semibold hover:bg-[#1b4332] flex items-center gap-1 shadow-sm whitespace-nowrap transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </form>
      </div>

      {/* Quick Filters Toolbar */}
      <div className="px-4 py-2 bg-white border-b border-[#E2E5DF] flex items-center justify-between text-xs text-[#717973]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase text-[#717973]">Filter View:</span>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
              filterMode === "all"
                ? "bg-[#1E3A2F] text-white"
                : "bg-[#F8F9F6] text-[#414844] border border-[#E2E5DF] hover:bg-[#EAECE7]"
            }`}
          >
            All Stalls ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("withholding")}
            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
              filterMode === "withholding"
                ? "bg-[#1E3A2F] text-white"
                : "bg-[#F8F9F6] text-[#414844] border border-[#E2E5DF] hover:bg-[#EAECE7]"
            }`}
          >
            Withholdings Only ({entries.filter((e) => e.status !== "bulk").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("conductivity")}
            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
              filterMode === "conductivity"
                ? "bg-[#1E3A2F] text-white"
                : "bg-[#F8F9F6] text-[#414844] border border-[#E2E5DF] hover:bg-[#EAECE7]"
            }`}
          >
            Conductivity Flaggers (&gt;6.0)
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[#717973] font-mono text-[11px]">
          <span>Tab / Enter jumps cell</span>
          <span>•</span>
          <span>Click status toggles dump</span>
        </div>
      </div>

      {/* High-Density Keyboard Data Table */}
      <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#F8F9F6] border-b border-[#E2E5DF] z-10">
            <tr className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider h-8">
              <th className="py-2 px-3 w-14 text-center">Unit #</th>
              <th className="py-2 px-3 w-40">Cow Tag &amp; Name</th>
              <th className="py-2 px-3 w-28">AM Yield (L)</th>
              <th className="py-2 px-3 w-48 text-center">Milk Discard / Status</th>
              <th className="py-2 px-3 w-28 text-center">Cond. (mS/cm)</th>
              <th className="py-2 px-3 w-24 text-center">Duration</th>
              <th className="py-2 px-3 w-20 text-center">SCC Flag</th>
              <th className="py-2 px-3">Notes / Action Taken</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E5DF] text-xs">
            {filteredEntries.map((row, idx) => {
              const isDanger = row.status === "waste";
              const isColostrum = row.status === "colostrum";

              let rowClass = "hover:bg-[#F8F9F6] transition-colors";
              if (isDanger) rowClass = "bg-red-50/50 hover:bg-red-50 transition-colors border-l-4 border-l-red-600";
              if (isColostrum) rowClass = "bg-amber-50/40 hover:bg-amber-50 transition-colors border-l-4 border-l-amber-500";

              return (
                <tr key={`${row.cowTag}-${idx}`} className={rowClass}>
                  {/* Unit # */}
                  <td className={`py-2 px-3 font-mono font-bold text-center ${isDanger ? "text-red-700 bg-red-100/50" : isColostrum ? "text-amber-900 bg-amber-100/50" : "text-[#1E3A2F] bg-[#F8F9F6]/60"}`}>
                    {row.unitNumber}
                  </td>

                  {/* Cow Tag & Name */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${isDanger ? "text-red-700" : isColostrum ? "text-amber-900" : "text-[#1E3A2F]"}`}>
                        {row.cowTag}
                      </span>
                      <span className="text-[#1F2421] font-medium text-xs">{row.cowName}</span>
                      {row.badge && (
                        <span className={`text-[10px] px-1 py-0.2 rounded font-semibold ${isDanger ? "bg-red-600 text-white" : "bg-amber-200 text-amber-900"}`}>
                          {row.badge}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* AM Yield (Editable) */}
                  <td className="py-1 px-3">
                    <input
                      type="number"
                      step="0.1"
                      value={row.amYield}
                      onChange={(e) => handleYieldChange(idx, e.target.value)}
                      className={`w-20 h-7 px-2 font-mono font-semibold text-right rounded border text-xs bg-white ${
                        isDanger
                          ? "border-red-400 text-red-700"
                          : isColostrum
                          ? "border-amber-400 text-amber-900"
                          : "border-[#E2E5DF] text-[#1E3A2F] focus:border-[#1E3A2F]"
                      }`}
                    />
                  </td>

                  {/* Milk Discard / Status Toggle */}
                  <td className="py-1 px-3 text-center">
                    {row.status === "bulk" && (
                      <button
                        type="button"
                        onClick={() => toggleStatus(idx)}
                        className="w-full h-7 px-2 rounded border border-[#86EFAC] bg-[#F0FDF4] text-[#15803D] text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:opacity-90"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Bulk Approved</span>
                      </button>
                    )}
                    {row.status === "waste" && (
                      <button
                        type="button"
                        onClick={() => toggleStatus(idx)}
                        className="w-full h-7 px-2 rounded border border-red-300 bg-red-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>DUMP TO WASTE (Rx)</span>
                      </button>
                    )}
                    {row.status === "colostrum" && (
                      <button
                        type="button"
                        onClick={() => toggleStatus(idx)}
                        className="w-full h-7 px-2 rounded border border-amber-400 bg-amber-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-amber-700"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>STORE AS COLOSTRUM</span>
                      </button>
                    )}
                  </td>

                  {/* Conductivity */}
                  <td className={`py-2 px-3 font-mono text-center font-semibold ${row.conductivity >= 6.0 ? "text-red-700 font-bold" : "text-[#1F2421]"}`}>
                    {row.conductivity} {row.conductivity >= 6.0 && <span className="text-[10px]">▲</span>}
                  </td>

                  {/* Duration */}
                  <td className="py-2 px-3 font-mono text-center text-[#717973]">{row.duration}</td>

                  {/* SCC Flag */}
                  <td className="py-2 px-3 text-center">
                    {row.sccFlag === "danger" && (
                      <span title="High SCC > 500k">
                        <AlertTriangle className="w-4 h-4 text-red-600 inline-block font-bold" />
                      </span>
                    )}
                    {row.sccFlag === "colostrum" && (
                      <span title="Colostrum - Do Not Bulk">
                        <Flag className="w-4 h-4 text-amber-600 inline-block font-bold" />
                      </span>
                    )}
                    {row.sccFlag === "marginal" && (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" title="Marginal SCC" />
                    )}
                    {(row.sccFlag === "optimal" || row.sccFlag === "normal") && (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" title="SCC Normal (<150k)" />
                    )}
                  </td>

                  {/* Notes / Action Taken */}
                  <td className="py-1 px-3">
                    <input
                      type="text"
                      value={row.notes}
                      onChange={(e) => handleNotesChange(idx, e.target.value)}
                      placeholder="Add note..."
                      className={`w-full h-7 px-2 text-xs rounded border bg-transparent focus:bg-white ${
                        isDanger
                          ? "border-red-200 text-red-700"
                          : isColostrum
                          ? "border-amber-200 text-amber-900"
                          : "border-transparent hover:border-[#E2E5DF] focus:border-[#1E3A2F]"
                      }`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Bottom Quick Entry Bar */}
      <div className="p-3 bg-[#F8F9F6] border-t border-[#E2E5DF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-[#717973]">
          <span className="font-mono">Showing {filteredEntries.length} of 242 entries</span>
          <span className="text-red-700 font-semibold flex items-center gap-1">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            Total Milk Withheld this shift: {totalWithheld.toFixed(1)} L
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onImportTelemetry}
            className="px-3 py-1.5 rounded bg-white border border-[#E2E5DF] hover:bg-[#F8F9F6] text-[#1F2421] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import Parlor Automated Telemetry</span>
          </button>
          <button
            type="button"
            onClick={() => onCommit?.(entries)}
            className="px-4 py-1.5 rounded bg-[#1E3A2F] text-white hover:bg-[#1b4332] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Commit Shift Entries</span>
          </button>
        </div>
      </div>
    </section>
  );
}
