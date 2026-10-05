"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, UserCheck } from "lucide-react";
import { useQuarantineRecords } from "../hooks/use-health";
import { QuarantineRecord } from "@/types/health";
import { AssignQuarantineModal } from "./assign-quarantine-modal";
import { ReleaseQuarantineModal } from "./release-quarantine-modal";

const DEFAULT_BAYS = [
  "Bay 01 - North",
  "Bay 02 - East",
  "Bay 03 - South",
  "Bay 04 - West",
];

export function QuarantineBayManager() {
  const { data: response, isLoading } = useQuarantineRecords({
    status: "ACTIVE",
    size: 20,
  });

  const activeRecords = response?.data?.content || [];

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBayForAssign, setSelectedBayForAssign] = useState<string | undefined>(undefined);

  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [recordToRelease, setRecordToRelease] = useState<QuarantineRecord | null>(null);

  const handleOpenAssign = (bayName?: string) => {
    setSelectedBayForAssign(bayName);
    setAssignModalOpen(true);
  };

  const handleOpenRelease = (record: QuarantineRecord) => {
    setRecordToRelease(record);
    setReleaseModalOpen(true);
  };

  // Map known bays to records
  const baySlots = DEFAULT_BAYS.map((bayName) => {
    const record = activeRecords.find(
      (r) => r.location.toLowerCase().trim() === bayName.toLowerCase().trim()
    );
    return {
      bayName,
      isOccupied: !!record,
      record: record || null,
    };
  });

  // Any active record not in default bays (e.g. Q-1, Q-2)
  const additionalRecords = activeRecords.filter(
    (r) =>
      !DEFAULT_BAYS.some(
        (b) => b.toLowerCase().trim() === r.location.toLowerCase().trim()
      )
  );

  const totalOccupied = activeRecords.length;

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E5DF]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-base font-bold text-[#1F2421] font-headline">
                Quarantine Isolation Stanchions
              </h3>
              <p className="text-xs text-[#717973]">
                Physical sick bays with bio-isolated milk diversion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              {totalOccupied} Active {totalOccupied === 1 ? "Bay" : "Bays"} Occupied
            </span>
            <button
              type="button"
              onClick={() => handleOpenAssign()}
              className="text-xs font-semibold px-2.5 py-1 bg-[#1E3A2F] text-white hover:bg-[#1b4332] rounded shadow-xs transition-colors"
            >
              + Isolate Animal
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-lg border border-[#E2E5DF]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {baySlots.map((slot) => {
              const { bayName, isOccupied, record } = slot;
              return (
                <div
                  key={bayName}
                  className={`p-3.5 rounded-lg border flex flex-col justify-between space-y-3 ${
                    isOccupied
                      ? "bg-red-50/40 border-red-200"
                      : "bg-[#F8F9F6] border-[#E2E5DF]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#1F2421]">{bayName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          isOccupied
                            ? "bg-red-600 text-white"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isOccupied ? "Occupied" : "Available"}
                      </span>
                    </div>

                    {isOccupied && record ? (
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="font-mono font-bold text-[#1E3A2F]">
                          {record.cowTagNumber}
                          {record.cowName ? ` • ${record.cowName}` : ""}
                        </div>
                        <div className="text-[11px] text-[#717973] line-clamp-2">
                          {record.reason}
                        </div>
                        <div className="text-[10px] text-red-700 font-semibold">
                          Day {record.daysInIsolation || 1} in isolation
                        </div>
                        {record.veterinarianName && (
                          <div className="text-[10px] text-[#717973] flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-[#1E3A2F]" />
                            {record.veterinarianName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-[#717973] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Clean &amp; Sanitized
                      </div>
                    )}
                  </div>

                  {isOccupied && record ? (
                    <button
                      type="button"
                      onClick={() => handleOpenRelease(record)}
                      className="w-full py-1 text-xs font-semibold rounded border transition-colors shadow-xs bg-white border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Release Animal
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAssign(bayName)}
                      className="w-full py-1 text-xs font-semibold rounded border transition-colors shadow-xs bg-white border-[#E2E5DF] text-[#1E3A2F] hover:bg-[#F8F9F6]"
                    >
                      Assign Animal
                    </button>
                  )}
                </div>
              );
            })}

            {/* Any additional bays (e.g. Q-1, Q-2) */}
            {additionalRecords.map((record) => (
              <div
                key={record.id}
                className="p-3.5 rounded-lg border flex flex-col justify-between space-y-3 bg-red-50/40 border-red-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1F2421]">
                      {record.location}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-red-600 text-white">
                      Occupied
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="font-mono font-bold text-[#1E3A2F]">
                      {record.cowTagNumber}
                      {record.cowName ? ` • ${record.cowName}` : ""}
                    </div>
                    <div className="text-[11px] text-[#717973] line-clamp-2">
                      {record.reason}
                    </div>
                    <div className="text-[10px] text-red-700 font-semibold">
                      Day {record.daysInIsolation || 1} in isolation
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenRelease(record)}
                  className="w-full py-1 text-xs font-semibold rounded border transition-colors shadow-xs bg-white border-red-300 text-red-700 hover:bg-red-50"
                >
                  Release Animal
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AssignQuarantineModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        defaultBay={selectedBayForAssign}
      />

      <ReleaseQuarantineModal
        isOpen={releaseModalOpen}
        onClose={() => setReleaseModalOpen(false)}
        record={recordToRelease}
      />
    </>
  );
}
