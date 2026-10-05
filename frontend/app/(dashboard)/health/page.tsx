"use client";

import React, { useState } from "react";
import {
  HealthKpiSummary,
  AntibioticWithdrawalTracker,
  QuarantineBayManager,
  TreatmentLogTable,
  RecordHealthModal,
} from "@/features/health";

export default function HealthPage() {
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F6] p-6 space-y-5">
      {/* Top Health & Vet KPIs */}
      <HealthKpiSummary />

      {/* Antibiotic Withdrawal Countdown Tracker */}
      <AntibioticWithdrawalTracker />

      {/* Quarantine Bay Manager */}
      <QuarantineBayManager />

      {/* Treatment Records & Diagnostics Table */}
      <TreatmentLogTable onNewCheck={() => setRecordModalOpen(true)} />

      {/* Record Health Check / Treatment Modal */}
      <RecordHealthModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
      />
    </div>
  );
}
