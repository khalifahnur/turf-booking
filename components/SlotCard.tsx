"use client";

import { BRAND, KSH, PITCH_OPTIONS } from "@/lib/booking";
import { PitchType, TimeSlot } from "@/lib/types";
import React, { useState } from "react";

export interface BookingRecord {
  date: string;
  pitchType: string;
  status: string;
  time: string;
}

function StatusDot({ status }: { status?: string }) {
  const baseColor = !status
    ? "#88b03f"
    : status === "Pending"
    ? "#fed107"
    : "#E10600";

  return (
    <span
      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 mt-0.5 sm:mt-1 ${
        status === "Pending" ? "animate-pulse" : ""
      }`}
      style={{ backgroundColor: baseColor }}
      aria-hidden="true"
    />
  );
}

function statusText(status?: string): string {
  if (!status) return "Available";
  if (status === "Pending") return "Awaiting Payment";
  return "Booked";
}

interface SlotCardProps {
  slot: TimeSlot;
  selectedDateStr: string;
  slotStatuses: BookingRecord[];
  onPitchSelect: (slot: TimeSlot, pitchType: PitchType) => void;
}

export default function SlotCard({
  slot,
  selectedDateStr,
  slotStatuses,
  onPitchSelect,
}: SlotCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { font } = BRAND;

  const safeStatuses = Array.isArray(slotStatuses) ? slotStatuses : [];

  const record5Aside = safeStatuses.find(
    (item) =>
      item.time === slot.timeRange &&
      item.pitchType === "5Aside" &&
      item.date === selectedDateStr
  );

  const record8Aside = safeStatuses.find(
    (item) =>
      item.time === slot.timeRange &&
      item.pitchType === "8Aside" &&
      item.date === selectedDateStr
  );

  const status5Aside = record5Aside?.status;
  const status8Aside = record8Aside?.status;

  const pitch5 = PITCH_OPTIONS.find((p) => p.type === "5Aside");
  const pitch8 = PITCH_OPTIONS.find((p) => p.type === "8Aside");

  const displayItems = [];

  if (pitch5 && pitch8) {
    if (status8Aside) {
      displayItems.push({ id: "8aside-1", pitch: pitch8, status: status8Aside });
    } else if (status5Aside) {
      displayItems.push({ id: "5aside-1", pitch: pitch5, status: status5Aside });
      displayItems.push({ id: "5aside-2", pitch: pitch5, status: undefined });
    } else {
      displayItems.push({ id: "5aside-1", pitch: pitch5, status: undefined });
      displayItems.push({ id: "8aside-1", pitch: pitch8, status: undefined });
    }
  }

  return (
    <article
      className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 border border-[#121e34]/10 bg-white"
      style={{ fontFamily: font }}
    >
      <header
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer hover:bg-[#F8F5F2] transition-colors duration-200 ${
          isOpen ? "border-b border-[#121e34]/10" : ""
        }`}
      >
        <time
          className="font-mono text-sm sm:text-base font-bold tracking-tight text-[#121e34]"
          dateTime={slot.startTime}
        >
          {slot.timeRange}
        </time>

        <div className="flex items-center gap-2.5">
          <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2 sm:py-1 rounded-full bg-[#1f4b50]/10 text-[#1f4b50]">
            2 hr Session
          </span>

          <svg
            className={`w-4 h-4 transition-transform duration-300 ease-in-out text-[#1f4b50] ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </header>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden bg-[#F8F5F2]/50">
          <div className="p-2 flex flex-col gap-1.5">
            {displayItems.map(({ id, pitch, status }) => {
              const isAvailable = !status;
              const isPending = status === "Pending";
              const isBooked = status === "Confirmed" || status === "Booked";

              const rowBg = isPending
                ? "#fffbeb"
                : isBooked
                ? "#fef2f2"
                : "#ffffff";

              const rowBorder = isPending
                ? "#fed107"
                : isBooked
                ? "#E10600"
                : "#121e341a";

              const priceColor = isBooked ? "#9ca3af" : "#121e34";

              return (
                <button
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAvailable) onPitchSelect(slot, pitch.type);
                  }}
                  disabled={!isAvailable}
                  aria-label={`Book ${pitch.label} for ${slot.timeRange} — ${statusText(status)}`}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-md border text-left transition-all duration-200 ${
                    isAvailable
                      ? "cursor-pointer hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.99]"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  style={{
                    backgroundColor: rowBg,
                    borderColor: rowBorder,
                  }}
                >
                  <StatusDot status={status} />

                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[11px] sm:text-xs text-[#121e34]">
                      {pitch.label}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-[11px] sm:text-xs" style={{ color: priceColor }}>
                      {KSH(pitch.price)}
                    </p>
                    <p
                      className="text-[9px] sm:text-[10px] font-semibold mt-0.5"
                      style={{
                        color: isPending ? "#fed107" : isBooked ? "#E10600" : "#88b03f",
                      }}
                    >
                      {statusText(status)}
                    </p>
                  </div>

                  {isAvailable && (
                    <svg
                      aria-hidden="true"
                      className="shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 text-[#88b03f]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}