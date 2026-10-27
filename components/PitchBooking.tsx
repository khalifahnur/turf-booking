"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { fetchBookings, fetchSchedule, initiateBooking } from "@/lib/api";
import type { BookingFormData, DayInfo, PitchType, SessionLength, TimeSlot } from "@/lib/types";
import { DEFAULT_SESSION_LENGTH } from "@/lib/booking";
import {
  buildDays,
  currentOperatingDate,
  formatWindows,
  isSlotOpen,
  slotsFor,
  venueClock,
} from "@/lib/schedule";
import { PitchBookingSlots } from "@/lib/slots";
import { useFooterReveal } from "@/hook/useFooterReveal";
import { useNow } from "@/hook/useNow";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import TestimonialsSection from "./TestimonialSection";
import FooterSection from "./FooterSection";
import BookingCard from "./BookingCard";
import BookingSheet from "./BookingModal";
import { usePaymentWebSocket } from "@/hook/usePaymentWebsocket";

export default function PitchBooking({
  heroTitle,
  heroSubtitle,
  heroExtra,
  membershipWidget,
  brandLogo,
  navActions,
  slideIndicator,
  testimonials,
  footer,
}: PitchBookingSlots = {}) {
  const queryClient = useQueryClient();

  // Which days can be booked, what each day's hours are (weekday, weekend or
  // public holiday) and the sessions that gives all come from the API, so this
  // page offers exactly what the server will accept.
  const {
    data: schedule,
    isError: scheduleFailed,
    refetch: refetchSchedule,
  } = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
    // The calendar only changes when the day does (or a holiday is declared), but
    // a page left open overnight must pick up the new day.
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
    retry: 2,
  });
  const now = useNow();

  // The venue's own clock, whatever timezone the visitor's device is in. The
  // operating day runs until the venue shuts in the early hours, so just after
  // midnight "today" is still yesterday's date.
  const clock = useMemo(
    () => (schedule && now !== null ? venueClock(new Date(now), schedule.timezone) : null),
    [schedule, now]
  );
  const firstDate = schedule && now !== null ? currentOperatingDate(schedule, new Date(now)) : null;
  const availableDays = useMemo(
    () => (schedule && firstDate ? buildDays(schedule, firstDate) : []),
    [schedule, firstDate]
  );

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const selectedDate: DayInfo | null =
    availableDays.find((d) => d.fullDateStr === selectedDateStr) ?? availableDays[0] ?? null;

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  // The day a slot was picked on. The booking is made for this day, not for
  // whichever day the calendar shows by the time the form is sent.
  const [pickedDay, setPickedDay] = useState<DayInfo | null>(null);
  const [selectedPitchType, setSelectedPitchType] = useState<PitchType | null>(null);
  const [duration, setDuration] = useState<SessionLength>(DEFAULT_SESSION_LENGTH);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    userName: "",
    email: "",
    phoneNumber: "",
  });

  const footerLayerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const { canReveal } = useFooterReveal(pageRef, footerLayerRef);

  const { data: slotStatuses = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    refetchInterval: 3_000,
  });

  const [txReference, setTxReference] = useState<string | null>(null);

  const { status: paymentStatus } = usePaymentWebSocket(txReference);

  useEffect(() => {
    if (!txReference) return;

    if (paymentStatus === "Completed") {
      toast.success("Payment received! Slot confirmed.", {
        id: "payment-toast", 
        duration: 5000,
      });
      
      setIsModalOpen(false);
      setTxReference(null);
      setSelectedSlot(null);
      setSelectedPitchType(null);

      queryClient.invalidateQueries({ queryKey: ["bookings"] });

    } else if (paymentStatus === "Failed") {
      toast.error("Payment failed or was cancelled.", {
        id: "payment-toast",
        duration: 5000,
      });
      setTxReference(null);
    }
  }, [paymentStatus, txReference, queryClient]);

  const bookingMutation = useMutation({
    mutationFn: initiateBooking,
    onSuccess: (data) => {
      if (data && data.reference) {
        setTxReference(data.reference);   
        toast.loading("Check your phone and enter M-Pesa PIN", {
          id: "payment-toast",
        });
       
      } else {
        toast.error("Invalid response from server");
      }
    },
    onError: (err: Error) => {
      toast.error(`${err}`);
    },
  });

  // Sessions that have started (less than the cut-off left) are no longer offered.
  const currentSlots = useMemo(() => {
    if (!schedule || !selectedDate || !clock) return [];
    return slotsFor(schedule, selectedDate.kind, duration).filter((slot) =>
      isSlotOpen(slot, selectedDate.fullDateStr, clock, schedule.minRemainingMinutes)
    );
  }, [schedule, selectedDate, clock, duration]);

  const bookingDay = selectedSlot && pickedDay ? pickedDay : selectedDate;
  const slotClosed =
    !!schedule &&
    !!clock &&
    !!selectedSlot &&
    !!pickedDay &&
    !isSlotOpen(selectedSlot, pickedDay.fullDateStr, clock, schedule.minRemainingMinutes);

  const hours = useMemo(() => {
    if (!schedule) return null;
    const { weekday, weekend, holiday } = schedule.kinds;
    return {
      weekday: formatWindows(weekday.windows),
      weekend: formatWindows(weekend.windows),
      holiday: formatWindows(holiday.windows),
    };
  }, [schedule]);

  const monthLabel =
    selectedDate?.dateObj.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }) ?? "";

  const handlePitchSelect = (slot: TimeSlot, pitchType: PitchType) => {
    setPickedDay(selectedDate);
    setSelectedSlot(slot);
    setSelectedPitchType(pitchType);
    setFormData({ userName: "", email: "", phoneNumber: "" });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !pickedDay || !selectedPitchType || slotClosed) return;
    bookingMutation.mutate({
      ...formData,
      phoneNumber: `254${formData.phoneNumber}`,
      date: pickedDay.fullDateStr,
      timeRange: selectedSlot.timeRange,
      pitchType: selectedPitchType,
    });
  };

  const handleCancelWait = () => {
    setTxReference(null);
    setIsModalOpen(false);
    toast.dismiss("payment-toast");
  };

  return (
    <div className="relative flex flex-col text-[#2c2825] bg-[#1f4b50]">
      {/* The footer is fixed underneath the page and uncovered as the page lifts
          away. When its content is taller than the screen that would clip it, so
          it falls back to sitting after the page like a normal footer. */}
      <div
        ref={footerLayerRef}
        className={
          canReveal
            ? "fixed bottom-0 left-0 w-full z-0 h-[100svh] overflow-hidden pointer-events-none"
            : "relative order-2 z-0 w-full"
        }
      >
        <div className={canReveal ? "pointer-events-auto h-full w-full" : "w-full"}>
          {footer ?? <FooterSection />}
        </div>
      </div>
      <div
        ref={pageRef}
        className={`relative z-10 bg-[#f8f5f2] rounded-b-[40px] lg:rounded-b-[60px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden ${
          canReveal ? "mb-[100svh]" : "order-1"
        }`}
      >
        <HeroSection
          navbar={<Navbar brandLogo={brandLogo}/>}
          bookingCard={
            <BookingCard
              availableDays={availableDays}
              selectedDate={selectedDate}
              scheduleStatus={schedule ? "ready" : scheduleFailed ? "error" : "loading"}
              onRetrySchedule={() => void refetchSchedule()}
              hours={hours}
              onDaySelect={(day) => {
                setSelectedDateStr(day.fullDateStr);
                setSelectedSlot(null);
                setSelectedPitchType(null);
                setIsModalOpen(true);
              }}
              monthLabel={monthLabel}
              onOpenSlots={() => {
                setSelectedSlot(null);
                setSelectedPitchType(null);
                setIsModalOpen(true);
              }}
            />
          }
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          heroExtra={heroExtra}
        />

        {testimonials ?? <TestimonialsSection />}
      </div>

      <BookingSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={bookingDay}
        currentSlots={currentSlots}
        windows={schedule && selectedDate ? schedule.kinds[selectedDate.kind].windows : []}
        slotClosed={slotClosed}
        slotStatuses={Array.isArray(slotStatuses) ? slotStatuses : []}
        duration={duration}
        onDurationChange={setDuration}
        onPitchSelect={handlePitchSelect}
        selectedSlot={selectedSlot}
        selectedPitchType={selectedPitchType}
        onBackToSlots={() => {
          setSelectedSlot(null);
          setSelectedPitchType(null);
        }}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleBookingSubmit}
        isSubmitting={bookingMutation.isPending}
        isWaiting={!!txReference}
        onCancelWait={handleCancelWait}
      />
    </div>
  );
}