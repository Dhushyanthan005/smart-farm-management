"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Stethoscope } from "lucide-react";

interface TreatmentRecord {
  id: string;
  date: string;
  cowTag: string;
  cowName: string;
  diagnosis: string;
  treatment: string;
  veterinarian: string;
  withdrawalDays: number;
  status: "Active" | "Resolved";
}

const MOCK_TREATMENTS: TreatmentRecord[] = [
  {
    id: "tx-01",
    date: "Oct 24, 08:30 AM",
    cowTag: "#1084",
    cowName: "Aurora B",
    diagnosis: "Subclinical Mastitis (Conductivity +38%)",
    treatment: "CMT Test Paddle + Intramammary Infusion",
    veterinarian: "Dr. Evans, DVM",
    withdrawalDays: 3,
    status: "Active",
  },
  {
    id: "tx-02",
    date: "Oct 23, 06:15 AM",
    cowTag: "#3190",
    cowName: "Duchess",
    diagnosis: "Acute Mastitis Right Rear",
    treatment: "Ceftiofur HCl 20ml IM",
    veterinarian: "Dr. Evans, DVM",
    withdrawalDays: 4,
    status: "Active",
  },
  {
    id: "tx-03",
    date: "Oct 22, 14:00 PM",
    cowTag: "#1045",
    cowName: "Buttercup",
    diagnosis: "Mild Left Quarter Swelling",
    treatment: "Spectramast LC 10ml",
    veterinarian: "Tech M. Alvarez",
    withdrawalDays: 2,
    status: "Active",
  },
  {
    id: "tx-04",
    date: "Oct 18, 10:00 AM",
    cowTag: "#1042",
    cowName: "Aurora",
    diagnosis: "Routine Hoof Trimming",
    treatment: "Copper sulfate preventative footbath",
    veterinarian: "Tech R. Jenkins",
    withdrawalDays: 0,
    status: "Resolved",
  },
];

interface TreatmentLogTableProps {
  onNewCheck?: () => void;
}

export function TreatmentLogTable({ onNewCheck }: TreatmentLogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_TREATMENTS.filter(
    (t) =>
      t.cowTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 bg-[#F8F9F6] border-b border-[#E2E5DF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#1E3A2F]" />
          <div>
            <h3 className="text-sm font-bold text-[#1E3A2F] font-headline">
              Clinical Veterinary Records &amp; Treatment Log
            </h3>
            <p className="text-xs text-[#717973]">Diagnoses, prescriptions, and veterinary round reports</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[#717973] absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tag, diagnosis..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          <button
            type="button"
            onClick={onNewCheck}
            className="h-8 px-3 bg-[#1E3A2F] text-white hover:bg-[#1b4332] text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Health Check</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8F9F6] border-b border-[#E2E5DF] text-[#717973] uppercase font-semibold text-[11px] h-9">
              <th className="py-2 px-3">Date &amp; Time</th>
              <th className="py-2 px-3">Animal</th>
              <th className="py-2 px-3">Diagnosis / Chief Complaint</th>
              <th className="py-2 px-3">Medication / Protocol</th>
              <th className="py-2 px-3">Administered By</th>
              <th className="py-2 px-3 text-center">Withdrawal</th>
              <th className="py-2 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E5DF] text-[#1F2421]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#F8F9F6] transition-colors">
                <td className="py-2.5 px-3 font-mono text-[#717973] whitespace-nowrap">{item.date}</td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-mono font-bold text-[#1E3A2F]">{item.cowTag}</div>
                  <div className="text-[11px] text-[#717973]">{item.cowName}</div>
                </td>
                <td className="py-2.5 px-3 font-medium">{item.diagnosis}</td>
                <td className="py-2.5 px-3 text-[#414844]">{item.treatment}</td>
                <td className="py-2.5 px-3 text-[#717973]">{item.veterinarian}</td>
                <td className="py-2.5 px-3 text-center">
                  {item.withdrawalDays > 0 ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {item.withdrawalDays} Days
                    </span>
                  ) : (
                    <span className="text-[#717973]">0d</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.status === "Active"
                        ? "bg-red-100 text-red-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
