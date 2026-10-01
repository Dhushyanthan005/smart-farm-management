"use client";

import React, { useState } from "react";

interface DayData {
  day: string;
  liters: string;
  pct: string;
  isToday?: boolean;
}

const WEEK_DATA: DayData[] = [
  { day: "Fri", liters: "13.9k", pct: "68%" },
  { day: "Sat", liters: "14.1k", pct: "72%" },
  { day: "Sun", liters: "14.0k", pct: "70%" },
  { day: "Mon", liters: "14.3k", pct: "79%" },
  { day: "Tue", liters: "14.2k", pct: "76%" },
  { day: "Wed", liters: "14.6k", pct: "86%" },
  { day: "Today", liters: "14.8k", pct: "94%", isToday: true },
];

export function ProductionTrendChart() {
  const [activeDay, setActiveDay] = useState<string>("Today");

  return (
    <div className="bg-white p-5 rounded-xl border border-[#E2E5DF] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#1F2421] font-headline">
            Lactation &amp; Production Trend
          </h3>
          <p className="text-xs text-[#717973]">
            7-day continuous volumetric vs temperature correlation
          </p>
        </div>

        {/* Metric Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#1E3A2F]">
            <span className="w-3 h-3 rounded-full bg-[#1E3A2F] inline-block" /> Total Liters (AM+PM)
          </span>
          <span className="flex items-center gap-1.5 text-[#717973]">
            <span className="w-3 h-1 bg-[#717973] rounded inline-block" /> Somatic Cell Index
          </span>
        </div>
      </div>

      {/* Bar / Telemetry Matrix Chart */}
      <div className="bg-[#F8F9F6] p-4 rounded-lg border border-[#E2E5DF]">
        <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-2">
          {WEEK_DATA.map((item) => {
            const isSelected = activeDay === item.day;
            return (
              <div
                key={item.day}
                onClick={() => setActiveDay(item.day)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              >
                <span
                  className={`text-[10px] font-bold transition-colors ${
                    item.isToday
                      ? "text-[#1E3A2F]"
                      : isSelected
                      ? "text-[#1E3A2F]"
                      : "text-[#717973] group-hover:text-[#1E3A2F]"
                  }`}
                >
                  {item.liters}
                </span>

                <div
                  className={`w-full max-w-[38px] rounded-t transition-all ${
                    item.isToday
                      ? "bg-[#1E3A2F] ring-2 ring-[#006c48]"
                      : isSelected
                      ? "bg-[#1E3A2F]"
                      : "bg-[#1E3A2F]/70 group-hover:bg-[#1E3A2F]"
                  }`}
                  style={{ height: item.pct }}
                />

                <span
                  className={`text-xs font-medium ${
                    item.isToday
                      ? "font-bold text-[#1E3A2F]"
                      : isSelected
                      ? "font-bold text-[#1E3A2F]"
                      : "text-[#717973]"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Supplementary Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-3 border-t border-[#E2E5DF] text-[#717973] gap-2">
          <span>
            Avg Daily Yield: <strong className="text-[#1F2421]">14,274 L</strong>
          </span>
          <span>
            SCC Average: <strong className="text-[#006c48]">112,000 cells/mL (Optimal)</strong>
          </span>
          <span>
            Peak Milking Time: <strong className="text-[#1F2421]">06:14 AM</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
