"use client";

import { DayInfo } from "@/lib/types";
import { BRAND } from "@/lib/booking";
import React from "react";

interface DayPickerProps {
  days: DayInfo[];
  selectedDate: DayInfo | null;
  onDaySelect: (day: DayInfo) => void;
  monthLabel: string;
}

export default function DayPicker({
  days,
  selectedDate,
  onDaySelect,
  monthLabel,
}: DayPickerProps) {
  const { font } = BRAND;

  return (
    <section aria-label="Select a date" className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <p
          className="text-sm font-semibold text-white/90"
          style={{ fontFamily: font }}
        >
          Date & Time
        </p>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#ffff]">
          {monthLabel}
        </p>
      </div>

      <div
        className="flex overflow-x-auto gap-2.5 pb-2 snap-x"
        role="listbox"
        aria-label="Available dates"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />

        {days.map((day) => {
          const isSelected = selectedDate?.fullDateStr === day.fullDateStr;

          return (
            <button
              key={day.fullDateStr}
              role="option"
              aria-selected={isSelected}
              aria-label={`${day.dayName} ${day.dateNum} ${day.monthName}${
                day.isWeekend ? ", weekend" : ""
              }`}
              onClick={() => onDaySelect(day)}
              className={`snap-start shrink-0 flex flex-col items-center justify-center py-3.5 rounded-[14px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6ff00] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                isSelected
                  ? "bg-[#00a64f] text-black border-[#00a64f] shadow-[0_0_15px_rgba(198,255,0,0.3)]"
                  : "bg-white/5 text-white border-white/10 hover:bg-white/15 border"
              }`}
              style={{
                width: 64,
                fontFamily: font,
                transform: isSelected ? "scale(1.02)" : "scale(1)",
              }}
            >
              <span
                className={`text-[9px] font-bold uppercase tracking-widest ${
                  isSelected ? "text-black/60" : "text-white/50"
                }`}
              >
                {day.monthName}
              </span>
              
              <span className="text-xl font-extrabold leading-tight my-0.5">
                {day.dateNum}
              </span>

              <span
                className={`text-[10px] font-bold ${
                  isSelected ? "text-black/70" : "text-white/60"
                }`}
              >
                {day.dayName}
              </span>

              {day.isWeekend && !isSelected && (
                <span
                  aria-hidden="true"
                  className="w-1 h-1 rounded-full mt-1 bg-[#c6ff00]/70"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}