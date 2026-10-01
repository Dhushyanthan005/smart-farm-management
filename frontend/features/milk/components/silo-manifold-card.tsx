"use client";

import React from "react";
import { Server, Radio } from "lucide-react";
import { SiloTank } from "../types/milk-log";

interface SiloManifoldCardProps {
  silos: SiloTank[];
}

export function SiloManifoldCard({ silos }: SiloManifoldCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[#1E3A2F] flex items-center gap-1.5 font-headline">
          <Server className="w-4 h-4 text-[#006c48]" />
          Bulk Silo Farm Manifold
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      <div className="space-y-2 font-mono text-xs">
        {silos.map((tank) => {
          const isReceiving = tank.status === "Receiving";
          return (
            <div
              key={tank.id}
              className={`flex items-center justify-between p-2 rounded border transition-colors ${
                isReceiving
                  ? "bg-emerald-50/60 border-emerald-300"
                  : "bg-[#F8F9F6] border-[#E2E5DF]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1E3A2F]">{tank.name}</span>
                <span
                  className={`text-[10px] px-1 rounded font-semibold ${
                    isReceiving
                      ? "bg-emerald-200 text-emerald-900"
                      : "bg-[#EAECE7] text-[#717973]"
                  }`}
                >
                  {isReceiving ? "Receiving" : tank.status}
                </span>
              </div>

              <span>
                {tank.currentVolume.toLocaleString()} L / {tank.capacity.toLocaleString()} L
              </span>

              <span
                className={`font-semibold ${
                  tank.temperature > 0 ? "text-emerald-700" : "text-[#717973]"
                }`}
              >
                {tank.temperature > 0 ? `${tank.temperature}°C` : tank.subStatus ?? "--"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
