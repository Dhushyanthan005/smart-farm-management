"use client";

import React, { useState } from "react";
import {
  HealthKpiSummary,
  AntibioticWithdrawalTracker,
  QuarantineBayManager,
  TreatmentLogTable,
} from "@/features/health";

export default function HealthPage() {
  const handleNewCheck = () => {
    alert("Record New Health Check: Opens clinical examination modal with CMT paddle scores and drug catalog.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F6] p-6 space-y-5">
      {/* Top Health & Vet KPIs */}
      <HealthKpiSummary />

      {/* Antibiotic Withdrawal Countdown Tracker */}
      <AntibioticWithdrawalTracker />

      {/* Quarantine Bay Manager */}
      <QuarantineBayManager />

      {/* Treatment Records & Diagnostics Table */}
      <TreatmentLogTable onNewCheck={handleNewCheck} />
    </div>
  );
}
