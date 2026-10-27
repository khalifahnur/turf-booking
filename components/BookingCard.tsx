"use client";

import type { DayInfo } from "@/lib/types";
import {  ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo } from "react";

/** The opening hours of each kind of day, as words ("7am – 9am and 3pm – 1am"). */
export interface HoursText {
  weekday: string;
  weekend: string;
  holiday: string;
}

interface BookingCardProps {
  availableDays: DayInfo[];
  selectedDate: DayInfo | null;
  scheduleStatus: "loading" | "error" | "ready";
  onRetrySchedule: () => void;
  hours: HoursText | null;
  onDaySelect: (day: DayInfo) => void;
  monthLabel: string;
  onOpenSlots: () => void;
  isHighlighting?: boolean; 
}

export default function BookingCard({
  availableDays,
  selectedDate,
  scheduleStatus,
  onRetrySchedule,
  hours,
  onDaySelect,
  monthLabel,
  onOpenSlots,
  isHighlighting = false, 
}: BookingCardProps) {
  const calendarCells = useMemo(() => {
    if (availableDays.length === 0) return [];
    const firstDay = availableDays[0];
    const firstDow = firstDay.dateObj.getDay(); 
    const cells: (DayInfo | null)[] = Array(firstDow).fill(null);
    return [...cells, ...availableDays.slice(0, 35 - firstDow)];
  }, [availableDays]);

  const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
  const hasHoliday = availableDays.some((d) => d.kind === "holiday");

  return (
    <div 
      id="booking-calendar"
      className={`relative mt-4 lg:mt-0 w-full transition-all duration-500 scroll-mt-24 ${
        isHighlighting 
          ? "ring-4 ring-[#88b03f]/50 ring-offset-4 scale-[1.02] z-10" 
          : "ring-0 scale-100 z-0"
      }`} 
    >
      <div className="bg-[#f8f5f2] rounded-[24px] lg:rounded-[28px] p-5 lg:p-6 pt-10 lg:pt-6 shadow-[0_15px_40px_rgba(18,30,52,0.15)] flex flex-col sm:flex-row gap-5 relative z-0">
        
        <div className="flex flex-col justify-between sm:w-[45%] lg:ml-7 mt-1 lg:mt-2">
          <div>
            <h3 className="text-base lg:text-lg font-bold text-[#121e34]">Book Your Slot</h3>
            <p className="text-[10px] lg:text-[11px] font-medium text-[#1f4b50] mt-1 lg:mt-1.5 max-w-[140px]">Because you deserve the best.</p>
          </div>

          {hours && (
            <dl
              aria-label="Opening hours"
              className="mt-3 sm:mt-6 space-y-1.5 text-[10px] lg:text-[11px] leading-snug text-[#1f4b50]"
            >
              <div>
                <dt className="font-bold text-[#121e34]">Mon – Fri</dt>
                <dd className="font-medium">{hours.weekday}</dd>
              </div>
              {hours.holiday === hours.weekend ? (
                <div>
                  <dt className="font-bold text-[#121e34]">Weekends &amp; public holidays</dt>
                  <dd className="font-medium">{hours.weekend}</dd>
                </div>
              ) : (
                <>
                  <div>
                    <dt className="font-bold text-[#121e34]">Weekends</dt>
                    <dd className="font-medium">{hours.weekend}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#121e34]">Public holidays</dt>
                    <dd className="font-medium">{hours.holiday}</dd>
                  </div>
                </>
              )}
            </dl>
          )}
        </div>

        <div className="sm:w-[55%] mt-1 lg:mt-0">
          <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
            <button className="text-[#1f4b50] hover:bg-[#F8F5F2] p-1 rounded-full transition-colors">
              <ChevronLeft size={12} />
            </button>
            <span className="text-[11px] lg:text-xs font-bold text-[#121e34]">{monthLabel}</span>
            <button className="text-[#1f4b50] hover:bg-[#F8F5F2] p-1 rounded-full transition-colors">
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 lg:gap-y-1.5 gap-x-1 text-center">
            {WEEKDAYS.map((d, i) => (
              <div key={i} className="text-[9px] lg:text-[10px] font-bold text-[#121e34]/70 mb-1">{d}</div>
            ))}
            
            {scheduleStatus === "ready" &&
              calendarCells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;

                const isSelected = selectedDate?.fullDateStr === day.fullDateStr;
                const isHoliday = day.kind === "holiday";
                const label = day.dateObj.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <button
                    key={day.fullDateStr}
                    onClick={() => onDaySelect(day)}
                    aria-pressed={isSelected}
                    aria-label={isHoliday ? `${label}, public holiday: ${day.holiday}` : label}
                    title={isHoliday ? day.holiday : undefined}
                    className={`relative w-5 h-5 lg:w-6 lg:h-6 mx-auto flex items-center justify-center rounded-full text-[9px] lg:text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] ${
                      isSelected
                        ? "bg-[#88b03f] text-white font-bold shadow-md shadow-[#88b03f]/30"
                        : "text-[#121e34] hover:bg-[#F8F5F2] font-semibold"
                    }`}
                  >
                    {day.dateNum}
                    {isHoliday && (
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-[1px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full ${
                          isSelected ? "bg-white" : "bg-[#E10600]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}

            {scheduleStatus === "loading" &&
              Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="mx-auto h-5 w-5 lg:h-6 lg:w-6 animate-pulse rounded-full bg-[#121e34]/[0.06]"
                />
              ))}
          </div>

          {scheduleStatus === "loading" && <p role="status" className="sr-only">Loading the booking calendar</p>}

          {scheduleStatus === "error" && (
            <div role="alert" className="py-4 text-center">
              <p className="text-[11px] font-semibold text-[#121e34]">We couldn&apos;t load the booking calendar.</p>
              <button
                type="button"
                onClick={onRetrySchedule}
                className="mt-2 rounded-full bg-[#1f4b50] px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#163a3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {scheduleStatus === "ready" && hasHoliday && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[9px] lg:text-[10px] font-medium text-[#121e34]/70">
              <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-[#E10600]" />
              Public holiday
            </p>
          )}
        </div>

      </div>
    </div>
  );
}