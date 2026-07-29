"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { fetchBookings, initiateBooking } from "@/lib/api";
import type { BookingFormData, DayInfo, PitchType, TimeSlot } from "@/lib/types";
import { BRAND, slotKey, WEEKDAY_SLOTS, WEEKEND_SLOTS } from "@/lib/booking";
import { PitchBookingSlots } from "@/lib/slots";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import TestimonialsSection from "./TestimonialSection";
import FooterSection from "./FooterSection";
import BookingCard from "./BookingCard";
import BookingSheet from "./BookingModal";
import { usePaymentWebSocket } from "@/hook/usePaymentWebsocket";

function buildAvailableDays(): DayInfo[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const y = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dow = date.getDay();
    return {
      dateObj: date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateNum: date.getDate(),
      monthName: date.toLocaleDateString("en-US", { month: "short" }),
      fullDateStr: `${y}-${mm}-${dd}`,
      isWeekend: dow === 0 || dow === 6,
    };
  });
}

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
  const { font } = BRAND;

  const [availableDays] = useState<DayInfo[]>(buildAvailableDays);
  const [selectedDate, setSelectedDate] = useState<DayInfo | null>(
    () => buildAvailableDays()[0] ?? null
  );

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedPitchType, setSelectedPitchType] = useState<PitchType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    userName: "",
    teamName: "",
    phoneNumber: "",
  });

  const [waitingSlotKey, setWaitingSlotKey] = useState<string | null>(null);

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
      toast.error(`Booking failed: ${err.message}`);
    },
  });

  const currentSlots = useMemo(
    () => (selectedDate?.isWeekend ? WEEKEND_SLOTS : WEEKDAY_SLOTS),
    [selectedDate]
  );

  const monthLabel =
    selectedDate?.dateObj.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }) ?? "";

  const handlePitchSelect = (slot: TimeSlot, pitchType: PitchType) => {
    setSelectedSlot(slot);
    setSelectedPitchType(pitchType);
    setIsModalOpen(true);
    setFormData({ userName: "", teamName: "", phoneNumber: "" });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate || !selectedPitchType) return;
    bookingMutation.mutate({
      ...formData,
      phoneNumber: `254${formData.phoneNumber}`,
      date: selectedDate.fullDateStr,
      timeRange: selectedSlot.timeRange,
      pitchType: selectedPitchType,
    });
  };

  const handleCancelWait = () => {
    setWaitingSlotKey(null);
    setIsModalOpen(false);
    toast.dismiss("payment-toast");
  };

  return (
    <div className="min-h-screen bg-[#1f4b50] text-white" style={{ fontFamily: font }}>
      <HeroSection
        navbar={<Navbar brandLogo={brandLogo} navActions={navActions} />}
        bookingCard={
          <BookingCard
            availableDays={availableDays}
            selectedDate={selectedDate}
            onDaySelect={setSelectedDate}
            monthLabel={monthLabel}
            currentSlots={currentSlots}
            slotStatuses={Array.isArray(slotStatuses) ? slotStatuses : []}
            onPitchSelect={handlePitchSelect}
          />
        }
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        heroExtra={heroExtra}
        membershipWidget={membershipWidget}
        slideIndicator={slideIndicator}
      />

      {testimonials ?? <TestimonialsSection />}
      {footer ?? <FooterSection />}
      
      <BookingSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSlot={selectedSlot}
        selectedDate={selectedDate}
        selectedPitchType={selectedPitchType}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleBookingSubmit}
        isSubmitting={bookingMutation.isPending}
        isWaiting={!!waitingSlotKey}
        onCancelWait={handleCancelWait}
      />
    </div>
  );
}