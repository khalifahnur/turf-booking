"use client";

import type { DayInfo } from "@/lib/types";
import { CalendarIcon, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import React, { useMemo } from "react";

interface BookingCardProps {
  availableDays: DayInfo[];
  selectedDate: DayInfo | null;
  onDaySelect: (day: DayInfo) => void;
  monthLabel: string;
  onOpenSlots: () => void;
}

export default function BookingCard({
  availableDays,
  selectedDate,
  onDaySelect,
  monthLabel,
  onOpenSlots,
}: BookingCardProps) {
  const calendarCells = useMemo(() => {
    if (availableDays.length === 0) return [];
    const firstDay = availableDays[0];
    const firstDow = firstDay.dateObj.getDay(); 
    const cells: (DayInfo | null)[] = Array(firstDow).fill(null);
    return [...cells, ...availableDays.slice(0, 35 - firstDow)];
  }, [availableDays]);

  const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="relative mt-4 lg:mt-0 w-full">
      {/* Kept the card white, but updated the shadow to use a subtle Navy Blue tint */}
      <div className="bg-[#f8f5f2] rounded-[24px] lg:rounded-[28px] p-5 lg:p-6 pt-10 lg:pt-6 shadow-[0_15px_40px_rgba(18,30,52,0.15)] flex flex-col sm:flex-row gap-5 relative z-0">
        
        <div className="flex flex-col justify-between sm:w-[45%] lg:ml-7 mt-1 lg:mt-2">
          <div>
            {/* Title: Navy Blue */}
            <h3 className="text-base lg:text-lg font-bold text-[#121e34]">Book Your Slot</h3>
            {/* Subtitle: Dark Teal */}
            <p className="text-[10px] lg:text-[11px] font-medium text-[#1f4b50] mt-1 lg:mt-1.5 max-w-[140px]">Because you deserve the best.</p>
          </div>
        </div>

        <div className="sm:w-[55%] mt-1 lg:mt-0">
          <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
            {/* Chevron Buttons: Dark Teal icons, Cream hover background */}
            <button className="text-[#1f4b50] hover:bg-[#F8F5F2] p-1 rounded-full transition-colors">
              <ChevronLeft size={12} />
            </button>
            {/* Month Label: Navy Blue */}
            <span className="text-[11px] lg:text-xs font-bold text-[#121e34]">{monthLabel}</span>
            <button className="text-[#1f4b50] hover:bg-[#F8F5F2] p-1 rounded-full transition-colors">
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 lg:gap-y-1.5 gap-x-1 text-center">
            {WEEKDAYS.map((d, i) => (
              // Weekdays: Slightly faded Navy Blue
              <div key={i} className="text-[9px] lg:text-[10px] font-bold text-[#121e34]/70 mb-1">{d}</div>
            ))}
            
            {calendarCells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              
              const isSelected = selectedDate?.fullDateStr === day.fullDateStr;
              
              return (
                <button
                  key={day.fullDateStr}
                  onClick={() => onDaySelect(day)}
                  className={`w-5 h-5 lg:w-6 lg:h-6 mx-auto flex items-center justify-center rounded-full text-[9px] lg:text-[10px] transition-colors ${
                    isSelected
                      // Selected state: Brand Green background, White text, and a soft Green shadow
                      ? "bg-[#88b03f] text-white font-bold shadow-md shadow-[#88b03f]/30"
                      // Unselected state: Navy text, Cream hover background
                      : "text-[#121e34] hover:bg-[#F8F5F2] font-semibold"
                  }`}
                >
                  {day.dateNum}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}