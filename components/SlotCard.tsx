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
    ? BRAND.colors.vibrantGreen
    : status === "Pending"
    ? BRAND.colors.electricYellow
    : BRAND.colors.red;

  return (
    <span
      className={`w-2 h-2 sm:w-[9px] sm:h-[9px] rounded-full shrink-0 mt-0.5 sm:mt-1 ${
        status === "Pending" ? "pending-pulse" : ""
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
  const { colors, font } = BRAND;

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
      className="slot-enter rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow duration-300"
      style={{
        fontFamily: font,
        backgroundColor: colors.surface1,
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <header
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3.5 py-3 sm:px-5 sm:py-4 cursor-pointer hover:bg-white/5 transition-colors duration-200"
        style={{ 
          borderBottom: isOpen ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent" 
        }}
      >
        <time
          className="font-mono text-base sm:text-xl font-extrabold tracking-tight"
          dateTime={slot.startTime}
          style={{ color: colors.white }}
        >
          {slot.timeRange}
        </time>

        <div className="flex items-center gap-3">
          <span
            className="text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-2.5 sm:py-1 rounded-full"
            style={{
              backgroundColor: "rgba(136,176,63,0.14)",
              color: colors.limeGreen,
            }}
          >
            2 hr Session
          </span>

          <svg
            className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            style={{ color: "rgba(255,255,255,0.4)" }}
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
        <div className="overflow-hidden">
          <div className="p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
            {displayItems.map(({ id, pitch, status }) => {
              const isAvailable = !status;
              const isPending = status === "Pending";
              const isBooked = status === "Confirmed" || status === "Booked";

              const rowBg = isPending
                ? "rgba(254,209,7,0.07)"
                : isBooked
                ? "rgba(225,6,0,0.06)"
                : "rgba(255,255,255,0.04)";

              const rowBorder = isPending
                ? "rgba(254,209,7,0.22)"
                : isBooked
                ? "rgba(225,6,0,0.18)"
                : "rgba(255,255,255,0.07)";

              const priceColor = isBooked
                ? "rgba(255,255,255,0.25)"
                : colors.electricYellow;

              return (
                <button
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    if (isAvailable) onPitchSelect(slot, pitch.type);
                  }}
                  disabled={!isAvailable}
                  aria-label={`Book ${pitch.label} for ${slot.timeRange} — ${statusText(
                    status
                  )}`}
                  className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg border text-left transition-all duration-200 ${
                    isAvailable
                      ? "pitch-row-available cursor-pointer hover:bg-white/5 hover:-translate-y-[1px] active:scale-[0.99]"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  style={{
                    backgroundColor: rowBg,
                    borderColor: rowBorder,
                  }}
                >
                  <StatusDot status={status} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-bold text-xs sm:text-[13px]"
                        style={{ color: colors.white }}
                      >
                        {pitch.label}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className="font-extrabold text-xs sm:text-[13px]"
                      style={{ color: priceColor }}
                    >
                      {KSH(pitch.price)}
                    </p>
                    <p
                      className="text-[10px] sm:text-[11px] font-semibold mt-0.5 sm:mt-1"
                      style={{
                        color: isPending
                          ? colors.electricYellow
                          : isBooked
                          ? colors.red
                          : colors.vibrantGreen,
                      }}
                    >
                      {statusText(status)}
                    </p>
                  </div>

                  {isAvailable && (
                    <svg
                      aria-hidden="true"
                      className="shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1"
                      style={{ color: "rgba(255,255,255,0.28)" }}
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