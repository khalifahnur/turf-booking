import { BRAND, KSH, PITCH_OPTIONS } from "@/lib/booking";
import { PitchType, TimeSlot } from "@/lib/types";
import React, { useState } from "react";

export interface BookingRecord {
  date: string;
  pitchType: string;
  status: string;
  time: string;
}

const INK = "#121e34";
const TEAL = "#1f4b50";
const GO = "#88b03f";
const CAUTION = "#fed107";
const STOP = "#E10600";

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
      item.date === selectedDateStr,
  );

  const record8Aside = safeStatuses.find(
    (item) =>
      item.time === slot.timeRange &&
      item.pitchType === "8Aside" &&
      item.date === selectedDateStr,
  );

  const status5Aside = record5Aside?.status;
  const status8Aside = record8Aside?.status;

  const pitch5 = PITCH_OPTIONS.find((p) => p.type === "5Aside");
  const pitch8 = PITCH_OPTIONS.find((p) => p.type === "8Aside");

  const displayItems = [];

  if (pitch5 && pitch8) {
    if (status8Aside) {
      displayItems.push({
        id: "8aside-1",
        pitch: pitch8,
        status: status8Aside,
      });
    } else if (status5Aside) {
      displayItems.push({
        id: "5aside-1",
        pitch: pitch5,
        status: status5Aside,
      });
      displayItems.push({ id: "5aside-2", pitch: pitch5, status: undefined });
    } else {
      displayItems.push({ id: "5aside-1", pitch: pitch5, status: undefined });
      displayItems.push({ id: "8aside-1", pitch: pitch8, status: undefined });
    }
  }

  const hasAvailablePitch = displayItems.some((item) => !item.status);

  const shouldShowContent = isOpen || !hasAvailablePitch ;

  return (
    <article
      className="relative overflow-hidden rounded-[18px] border border-[#121e34]/10 bg-white shadow-[0_1px_3px_rgba(18,30,52,0.06)]"
      style={{ fontFamily: font }}
    >
      <header
        onClick={() => {
          if (hasAvailablePitch) {
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={shouldShowContent}
        className={`group relative flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-3 py-2.5 transition-colors duration-200 sm:gap-x-3 sm:px-5 sm:py-3.5 ${
          hasAvailablePitch ? "cursor-pointer hover:bg-[#F8F5F2]/70" : ""
        } ${shouldShowContent ? "border-b border-[#121e34]/[0.08]" : ""}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-4 -top-4 h-8 w-8 rounded-full border border-[#1f4b50]/15"
        />

        <time
          className="font-mono text-sm font-bold tabular-nums tracking-tight text-[#121e34] sm:text-base"
          dateTime={slot.startTime}
        >
          {slot.timeRange}
        </time>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <span
            className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-bold normal-case tracking-normal sm:px-2 sm:py-1 sm:text-[10px] sm:uppercase sm:tracking-wider"
            style={{ backgroundColor: `${TEAL}14`, color: TEAL }}
          >
            <span className="sm:hidden">2hr</span>
            <span className="hidden sm:inline">2 hr Session</span>
          </span>

          {!hasAvailablePitch && (
            <span
              className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-normal sm:px-2 sm:py-1 sm:text-[10px] sm:tracking-wider"
              style={{ backgroundColor: `${STOP}14`, color: STOP }}
            >
              Booked
            </span>
          )}

          {hasAvailablePitch && (
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#121e34]/15 transition-colors duration-200 group-hover:border-[#121e34]/30 group-hover:bg-[#121e34]/5 sm:h-7 sm:w-7">
              <span className="absolute inset-0 m-auto h-[1.5px] w-2 rounded-full bg-[#121e34] sm:w-2.5" />
              <span
                className={`absolute inset-0 m-auto h-[1.5px] w-2 rounded-full bg-[#121e34] transition-transform duration-300 sm:w-2.5 ${
                  isOpen ? "rotate-90 scale-x-0" : "rotate-90 scale-x-100"
                }`}
              />
            </span>
          )}
        </div>
      </header>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          shouldShowContent
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden bg-[#F8F5F2]/60">
          <div className="flex flex-col gap-1.5 p-2 sm:gap-2 sm:p-2.5">
            {displayItems.map(({ id, pitch, status }) => {
              const isAvailable = !status;
              const isPending = status === "Pending";
              const isBooked = !isAvailable && !isPending;

              const rowBg = isPending
                ? "#FFFBEA"
                : isBooked
                  ? "#F4F5F7"
                  : "#FFFFFF";
              const rowBorder = isPending
                ? CAUTION
                : isBooked
                  ? "#D7DBE2"
                  : "#121e3414";
              const labelColor = isBooked ? "#9096A1" : INK;
              const priceColor = isBooked ? "#A6ACB6" : INK;
              const statusColor = isPending
                ? "#B45309"
                : isBooked
                  ? "#6B7280"
                  : GO;
              const displayStatus = status || "Available";

              return (
                <button
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAvailable) onPitchSelect(slot, pitch.type);
                  }}
                  disabled={!isAvailable}
                  aria-label={`Book ${pitch.label} for ${slot.timeRange} — ${displayStatus}`}
                  className={`group relative flex w-full items-center justify-between gap-1.5 overflow-hidden rounded-[10px] border py-2.5 pl-3 pr-2.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 sm:gap-2 sm:py-3 sm:pl-4 sm:pr-3.5 ${
                    isAvailable ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: rowBg, borderColor: rowBorder }}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 h-full w-[3px] origin-center scale-y-0 bg-[#1f4b50] transition-transform duration-200 ${
                      isAvailable ? "group-hover:scale-y-100" : ""
                    }`}
                  />

                  {isAvailable && (
                    <>
                      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                        <span
                          className="truncate text-[11px] font-bold sm:text-xs"
                          style={{ color: labelColor }}
                        >
                          {pitch.label}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <div className="flex flex-col items-end">
                          <p
                            className="text-[11px] font-bold tabular-nums sm:text-xs"
                            style={{ color: priceColor }}
                          >
                            {KSH(pitch.price)}
                          </p>
                          <p
                            className="mt-0.5 text-[9px] font-bold uppercase tracking-wider sm:text-[10px]"
                            style={{ color: statusColor }}
                          >
                            {displayStatus}
                          </p>
                        </div>
                          <span
                            aria-hidden="true"
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#88b03f]/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:border-[#88b03f] group-hover:bg-[#88b03f]/10 sm:h-7 sm:w-7"
                          >
                            <svg
                              className="h-2.5 w-2.5 text-[#88b03f] sm:h-3.5 sm:w-3.5"
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
                          </span>
                        
                      </div>
                    </>
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
