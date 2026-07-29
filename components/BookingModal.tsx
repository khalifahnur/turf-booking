"use client";

import { BRAND, PITCH_OPTIONS } from "@/lib/booking";
import { BookingFormData, DayInfo, PitchType, TimeSlot } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Field } from "./Field";

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
  selectedSlot: TimeSlot | null;
  selectedDate: DayInfo | null;
  selectedPitchType: PitchType | null;
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
  selectedSlot,
  selectedDate,
  selectedPitchType,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  isWaiting,
  onCancelWait,
}: BookingSheetProps) {
  const { colors, font } = BRAND;
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  if (!selectedSlot || !selectedDate || !selectedPitchType) return null;

  const pitch = PITCH_OPTIONS.find((p) => p.type === selectedPitchType)!;
  const isBusy = isSubmitting || isWaiting;

  const accentColor = pitch.type === "5Aside" ? colors.royalBlue : colors.darkTeal;
  const accentText = pitch.type === "5Aside" ? "#8babff" : "#5ecdd4";

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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && !isBusy && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-white/5 flex flex-col [&>button]:hidden backdrop-blur-xl transition-transform duration-500"
        style={{ 
          backgroundColor: "rgba(0,0,0,0.45)", 
          fontFamily: font 
        }}
      >
        <div
          className="px-6 pt-10 pb-8 shrink-0 relative overflow-hidden"
          style={{
            backgroundColor: "rgba(255,255,255,0.01)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />
          
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <span
                className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-inner"
                style={{
                  backgroundColor: `${accentColor}25`,
                  color: accentText,
                  border: `1px solid rgba(255,255,255,0.03)`,
                }}
              >
                {pitch.label}
              </span>

              <h3
                id="modal-title"
                className="text-[26px] font-extrabold leading-tight tracking-tight"
                style={{ color: colors.white }}
              >
                Confirm Booking
              </h3>

              <p className="text-[14px] mt-1.5 font-medium opacity-60" style={{ color: colors.white }}>
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
          <form onSubmit={handleLocalSubmit} className="px-6 py-6 space-y-0.5">
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

            <div className="pt-8 space-y-4">
              <button
                type="submit"
                disabled={isBusy}
                className="w-full flex items-center h-14 justify-center gap-2.5 rounded-full font-bold text-[15px] transition-all duration-300 focus:outline-none relative group overflow-hidden shadow-lg active:scale-[0.98]"
                style={{
                  backgroundColor: isBusy ? `${colors.vibrantGreen}60` : colors.vibrantGreen,
                  color: colors.white,
                  letterSpacing: "0.01em",
                }}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 group-hover:bg-white/20" />
                
                {(isSubmitting || isWaiting) && <Spinner />}
                
                <span className="z-10 tracking-tight font-extrabold">
                  {isSubmitting ? "Sending STK Push…" : isWaiting ? "Awaiting M-Pesa PIN…" : "Pay"}
                </span>
              </button>

              {isWaiting ? (
                <button
                  type="button"
                  onClick={onCancelWait}
                  className="w-full py-3 h-12 text-[13px] font-bold transition-all duration-300 rounded-full active:scale-[0.98]"
                  style={{ 
                    color: colors.white, 
                    fontFamily: font,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderTop: `1px solid rgba(255,255,255,0.05)`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  Cancel &amp; Close
                </button>
              ) : (
                !isBusy && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full h-12 py-3 text-[13px] font-semibold transition-all rounded-full hover:bg-white/5 active:scale-[0.98]"
                    style={{ color: colors.white, opacity: 0.5, fontFamily: font }}
                  >
                    Close
                  </button>
                )
              )}
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}