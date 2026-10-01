"use client";

import React from "react";
import { Stethoscope, CheckCircle2, Clock, ClipboardList } from "lucide-react";

interface ScheduledVetRoundsProps {
  onOpenProtocol?: () => void;
}

export function ScheduledVetRounds({ onOpenProtocol }: ScheduledVetRoundsProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#E2E5DF] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#1E3A2F]" />
          <h3 className="text-base font-bold text-[#1F2421] font-headline">
            Scheduled Vet Rounds
          </h3>
        </div>
        <span className="text-xs bg-[#F4F6F2] px-2 py-0.5 rounded text-[#1F2421] font-semibold">
          Today @ 14:00
        </span>
      </div>

      {/* Vet Doctor Card */}
      <div className="flex items-center gap-3 p-3 bg-[#F8F9F6] rounded-lg border border-[#E2E5DF]">
        <div className="w-10 h-10 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-sm">
          DE
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#1F2421] truncate">Dr. Evans, DVM</h4>
            <span className="text-[11px] font-bold text-[#006c48]">On-Call Confirmed</span>
          </div>
          <p className="text-xs text-[#717973] truncate">Lead Herd Health Veterinarian</p>
        </div>
      </div>

      {/* Protocol Checklist */}
      <div className="space-y-1.5 text-xs text-[#414844] pt-1">
        <div className="flex items-center justify-between py-1.5 border-b border-[#E2E5DF]">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1E3A2F] flex-shrink-0" />
            <span>Post-calving check: Cow #1198 &amp; #1201</span>
          </span>
          <span className="text-[11px] text-[#717973]">Maternity</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-[#E2E5DF]">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1E3A2F] flex-shrink-0" />
            <span>Pregnancy confirmation ultrasounds (14 head)</span>
          </span>
          <span className="text-[11px] text-[#717973]">Chute 01</span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Clinical assessment: Cow #1084 (Mastitis)</span>
          </span>
          <span className="text-[11px] text-red-600 font-semibold">Priority</span>
        </div>
      </div>

      {/* Footer Action */}
      <button
        type="button"
        onClick={onOpenProtocol}
        className="w-full h-8 mt-2 bg-[#F4F6F2] border border-[#E2E5DF] hover:bg-[#EAECE7] hover:text-[#1F2421] text-[#1E3A2F] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
      >
        <ClipboardList className="w-4 h-4" />
        <span>Open Clinical Protocol &amp; Prep Chute</span>
      </button>
    </div>
  );
}
