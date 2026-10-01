import React from "react";
import { Radio } from "lucide-react";

export function LiveAlertTicker() {
  return (
    <div className="bg-[#F4F6F2] px-6 py-1.5 border-b border-[#E2E5DF] flex items-center justify-between text-xs text-gray-600 select-none">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px] uppercase tracking-wider">
          Live System Ticker
        </span>
        <span className="text-[#1F2421] font-medium truncate">
          2 Quarantined • Bulk Tank 04 at 92% • 1 Vet Review Pending (Cow #1084 Barn C)
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-3 text-[11px] text-gray-500 flex-shrink-0">
        <span className="flex items-center gap-1 font-mono-data">
          <Radio className="w-3.5 h-3.5 text-[#4D6A42]" />
          Telemetry Sync: 14s ago
        </span>
        <span>•</span>
        <span>Parlor Ambient: 18.2°C (Hum 52%)</span>
      </div>
    </div>
  );
}
