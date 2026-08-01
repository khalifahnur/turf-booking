"use client";

import { BRAND, PITCH_OPTIONS } from "@/lib/booking";
import { BookingFormData, DayInfo, PitchType, TimeSlot } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Field } from "./Field";
import SlotCard from "./SlotCard";
import { ChevronLeft } from "lucide-react";

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="animate-spin h-5 w-5 text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface BookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: DayInfo | null;
  currentSlots: TimeSlot[];
  slotStatuses: any[];
  onPitchSelect: (slot: TimeSlot, pitchType: PitchType) => void;
  selectedSlot: TimeSlot | null;
  selectedPitchType: PitchType | null;
  onBackToSlots: () => void;
  formData: BookingFormData;
  onFormChange: (data: BookingFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isWaiting: boolean;
  onCancelWait: () => void;
}

export default function BookingSheet({
  isOpen,
  onClose,
  selectedDate,
  currentSlots,
  slotStatuses,
  onPitchSelect,
  selectedSlot,
  selectedPitchType,
  onBackToSlots,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  isWaiting,
  onCancelWait,
}: BookingSheetProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  if (!selectedDate) return null;

  const isBusy = isSubmitting || isWaiting;

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) newErrors.userName = "Representative name is required";
    if (!formData.teamName.trim()) newErrors.teamName = "Team name is required";

    const phoneRegex = /^[17]\d{8}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter exactly 9 digits starting with 7 or 1 (e.g. 712345678)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(e);
  };

  const renderSlotList = () => (
    <>
      <div className="px-6 pt-8 pb-5 shrink-0 relative overflow-hidden border-b border-[#121e34]/10">
        <h3
          id="modal-title"
          className="text-2xl font-playfair font-semibold leading-tight tracking-tight text-[#121e34]"
        >
          Select a Time
        </h3>
        <p className="text-xs mt-1.5 font-medium opacity-80 text-[#1f4b50]">
          {selectedDate.dateObj.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
        {currentSlots.length > 0 ? (
          currentSlots.map((slot) => (
            <SlotCard
              key={slot.timeRange}
              slot={slot}
              selectedDateStr={selectedDate.fullDateStr}
              slotStatuses={slotStatuses}
              onPitchSelect={onPitchSelect}
            />
          ))
        ) : (
          <p className="text-center text-[#1f4b50]/70 py-8 text-sm font-medium">
            No sessions available for this day.
          </p>
        )}
      </div>
    </>
  );

  const renderBookingForm = () => {
    if (!selectedSlot || !selectedPitchType) return null;
    const pitch = PITCH_OPTIONS.find((p) => p.type === selectedPitchType)!;
    const accentColor = pitch.type === "5Aside" ? "#88b03f" : "#1f4b50"; 

    return (
      <>
        <div className="px-6 pt-6 pb-8 shrink-0 relative overflow-hidden border-b border-[#121e34]/10">
          <button 
            onClick={onBackToSlots}
            disabled={isBusy}
            className="flex items-center gap-1 text-[#1f4b50] hover:text-[#121e34] mb-4 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={16} /> Back to times
          </button>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-sm text-white"
                style={{ backgroundColor: accentColor }}
              >
                {pitch.label}
              </span>

              <h3 className="text-2xl font-playfair font-semibold leading-tight tracking-tight text-[#121e34]">
                Confirm Booking
              </h3>

              <p className="text-xs mt-1.5 font-medium opacity-80 text-[#1f4b50]">
                {selectedDate.dateObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {selectedSlot.timeRange}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <form onSubmit={handleLocalSubmit} className="px-6 py-6 space-y-3">
            <Field
              label="Representative Name"
              value={formData.userName}
              onChange={(v) => onFormChange({ ...formData, userName: v })}
              placeholder="Team Captain"
              disabled={isBusy}
              error={errors.userName}
            />
            <Field
              label="Team Name"
              value={formData.teamName}
              onChange={(v) => onFormChange({ ...formData, teamName: v })}
              placeholder="e.g. FC Spartans"
              disabled={isBusy}
              error={errors.teamName}
            />
            <Field
              label="M-Pesa Number"
              type="tel"
              prefix="+254"
              maxLength={9}
              value={formData.phoneNumber}
              onChange={(v) => onFormChange({ ...formData, phoneNumber: v })}
              placeholder="7XXXXXXXX"
              disabled={isBusy}
              error={errors.phoneNumber}
            />

            <div className="pt-6 space-y-3">
              <button
                type="submit"
                disabled={isBusy}
                className="w-full flex items-center h-12 justify-center gap-2.5 rounded-full font-semibold text-[14px] text-white transition-all duration-300 focus:outline-none relative group overflow-hidden shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 bg-[#88b03f] hover:bg-[#769a35]"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 group-hover:bg-white/30" />
                
                {(isSubmitting || isWaiting) && <Spinner />}
                
                <span className="z-10 tracking-wide">
                  {isSubmitting ? "Sending STK Push…" : isWaiting ? "Awaiting M-Pesa PIN…" : "Confirm & Pay"}
                </span>
              </button>

              {isWaiting ? (
                <button
                  type="button"
                  onClick={onCancelWait}
                  className="w-full py-2.5 h-11 text-xs font-bold transition-all duration-300 rounded-full active:scale-[0.98] text-[#1f4b50] bg-[#F8F5F2] hover:bg-[#1f4b50]/10 border border-[#1f4b50]/10"
                >
                  Cancel &amp; Close
                </button>
              ) : (
                !isBusy && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full h-11 py-2.5 text-xs font-bold transition-all rounded-full active:scale-[0.98] text-[#1f4b50] hover:bg-[#F8F5F2]"
                  >
                    Close
                  </button>
                )
              )}
            </div>
          </form>
        </div>
      </>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && !isBusy && onClose()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`w-full p-0 border-[#121e34]/10 flex flex-col [&>button]:hidden backdrop-blur-xl transition-transform duration-500 bg-white shadow-2xl ${isMobile ? "h-[85vh] rounded-t-3xl border-t" : "sm:max-w-md border-l"}`}
      >
        {selectedSlot ? renderBookingForm() : renderSlotList()}
      </SheetContent>
    </Sheet>
  );
}