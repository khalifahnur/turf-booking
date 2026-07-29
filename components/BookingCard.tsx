"use client";

import type { DayInfo, PitchType, TimeSlot } from "@/lib/types";
import DayPicker from "./DayPicker";
import SlotCard from "./SlotCard";

interface BookingCardProps {
  availableDays: DayInfo[];
  selectedDate: DayInfo | null;
  onDaySelect: (day: DayInfo) => void;
  monthLabel: string;
  currentSlots: TimeSlot[];
  slotStatuses: any[];
  onPitchSelect: (slot: TimeSlot, pitchType: PitchType) => void;
}

export default function BookingCard({
  availableDays,
  selectedDate,
  onDaySelect,
  monthLabel,
  currentSlots,
  slotStatuses,
  onPitchSelect,
}: BookingCardProps) {

  return (
    <div
      className="w-full rounded-[28px] p-6 sm:p-7 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.09)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full blur-[90px]"
        style={{ background: "rgba(198,255,0,0.10)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 w-44 h-44 rounded-full blur-[80px]"
        style={{ background: "rgba(59,130,246,0.07)" }}
      />

      <div className="relative">
        <DayPicker
          days={availableDays}
          selectedDate={selectedDate}
          onDaySelect={onDaySelect}
          monthLabel={monthLabel}
        />
      </div>

      <div
        className="relative flex flex-col gap-2.5 overflow-y-auto pr-1 pb-1 -mr-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.14) transparent",
        }}
      >
        {currentSlots.length > 0 ? (
          currentSlots.map((slot) => (
            <SlotCard
              key={slot.timeRange}
              slot={slot}
              selectedDateStr={selectedDate?.fullDateStr ?? ""}
              slotStatuses={slotStatuses}
              onPitchSelect={onPitchSelect}
            />
          ))
        ) : (
          <p className="text-center text-white/45 py-8 text-sm">
            No sessions available for this day.
          </p>
        )}
      </div>

    </div>
  );
}