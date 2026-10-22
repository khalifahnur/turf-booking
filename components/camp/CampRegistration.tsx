"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";
import { CAMP_FAILED, CampApiError, registerCamp } from "@/lib/api";
import {
  CAMP_PROGRAMS,
  CAMP_TERMS_VERSION,
  CAMP_WEEKS,
  DETAILS_PROBLEM,
  cleanName,
  emailError,
  formatPhone,
  isWeekOpen,
  nameError,
  phoneError,
  quoteCamp,
  type CampProgramId,
} from "@/lib/camp";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import DetailsStep, { type DetailsErrors, type DetailsValues } from "./DetailsStep";
import PaymentFlow from "./PaymentFlow";
import PlanStep from "./PlanStep";
import Stepper from "./Stepper";
import Summary from "./Summary";

const EMPTY: DetailsValues = { childName: "", parentName: "", email: "", phone: "", acceptedTerms: false };

export default function CampRegistration({ today }: { today: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<DetailsValues>(EMPTY);
  const [errors, setErrors] = useState<DetailsErrors>({});
  const [program, setProgram] = useState<CampProgramId | null>(null);
  const [lunch, setLunch] = useState(false);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [charged, setCharged] = useState<number | null>(null);
  const [focusTick, setFocusTick] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);

  const openWeeks = useMemo(() => CAMP_WEEKS.filter((w) => isWeekOpen(w, today)), [today]);
  const selectedWeeks = useMemo(() => CAMP_WEEKS.filter((w) => weeks.includes(w.start)), [weeks]);
  const quote = quoteCamp(program, lunch, selectedWeeks.length);
  const phoneLabel = formatPhone(details.phone);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, focusTick]);

  const mutation = useMutation({
    mutationFn: registerCamp,
    onSuccess: (data) => {
      setCharged(data.total);
      setReference(data.reference);
    },
    onError: (err) => setSubmitError(err instanceof CampApiError ? err.message : CAMP_FAILED),
  });

  const change: React.ComponentProps<typeof DetailsStep>["onChange"] = (key, value) => {
    setDetails((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const goTo = (next: 1 | 2) => {
    moveFocus.current = true;
    setSubmitError(null);
    setStep(next);
  };

  const handleNext = () => {
    const found: DetailsErrors = {
      childName: nameError(details.childName, "child"),
      parentName: nameError(details.parentName, "parent"),
      email: emailError(details.email),
      phone: phoneError(details.phone),
      acceptedTerms: details.acceptedTerms ? undefined : "Please tick the box to accept the terms and conditions",
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      requestAnimationFrame(() =>
        cardRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    goTo(2);
  };

  const handlePay = () => {
    if (!program || weeks.length === 0 || mutation.isPending) return;
    setSubmitError(null);
    mutation.mutate({
      childName: cleanName(details.childName),
      parentName: cleanName(details.parentName),
      email: details.email.trim(),
      phoneNumber: `254${details.phone}`,
      program,
      lunch,
      weeks: selectedWeeks.map((w) => w.start),
      acceptedTerms: true,
      termsVersion: CAMP_TERMS_VERSION,
    });
  };

  const startAgain = () => {
    mutation.reset();
    setDetails((d) => ({ ...EMPTY, parentName: d.parentName, email: d.email, phone: d.phone }));
    setErrors({});
    setProgram(null);
    setLunch(false);
    setWeeks([]);
    setSubmitError(null);
    setReference(null);
    setCharged(null);
    goTo(1);
  };

  const backToPlan = () => {
    mutation.reset();
    setSubmitError(null);
    setReference(null);
    setCharged(null);
    moveFocus.current = true;
    setFocusTick((t) => t + 1);
  };

  if (openWeeks.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4">
        <div className="rounded-xl border border-[#121e34]/10 bg-white p-5 text-center shadow-xs sm:p-6">
          <h2 className="font-playfair text-lg font-semibold text-[#121e34] sm:text-xl">Registration has closed</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-[#121e34]/65 sm:text-[13px]">
            This year&rsquo;s camp has finished. Call {PHONE_DISPLAY} to hear about the next one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 px-3.5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6">
      <div
        ref={cardRef}
        className="rounded-xl border border-[#121e34]/10 bg-white p-4 shadow-xs sm:rounded-2xl sm:p-6"
      >
        {reference ? (
          <PaymentFlow
            key={reference}
            reference={reference}
            childName={details.childName}
            programLabel={CAMP_PROGRAMS.find((p) => p.id === program)?.label ?? ""}
            weeks={selectedWeeks}
            lunch={lunch}
            total={charged ?? quote.total}
            phoneLabel={phoneLabel}
            onBackToPlan={backToPlan}
            onRegisterAnother={startAgain}
          />
        ) : (
          <>
            <Stepper step={step} />
            <div className="mt-5">
              <div aria-live="polite" className="sr-only">
                {step === 1 ? "Step 1 of 2: your details" : "Step 2 of 2: plan and payment"}
              </div>
              {step === 1 ? (
                <DetailsStep
                  values={details}
                  errors={errors}
                  onChange={change}
                  onNext={handleNext}
                  headingRef={headingRef}
                />
              ) : (
                <PlanStep
                  today={today}
                  childName={details.childName}
                  phoneLabel={phoneLabel}
                  program={program}
                  weeks={weeks}
                  lunch={lunch}
                  quote={quote}
                  selectedWeeks={selectedWeeks}
                  error={submitError}
                  errorIsAboutDetails={!!submitError && DETAILS_PROBLEM.test(submitError)}
                  isPaying={mutation.isPending}
                  headingRef={headingRef}
                  onProgram={(id) => {
                    setProgram(id);
                    setSubmitError(null);
                  }}
                  onToggleWeek={(start) => {
                    setWeeks((cur) => (cur.includes(start) ? cur.filter((w) => w !== start) : [...cur, start]));
                    setSubmitError(null);
                  }}
                  onToggleAllWeeks={() => {
                    const all = openWeeks.every((w) => weeks.includes(w.start));
                    setWeeks(all ? [] : openWeeks.map((w) => w.start));
                    setSubmitError(null);
                  }}
                  onLunch={setLunch}
                  onBack={() => goTo(1)}
                  onPay={handlePay}
                />
              )}
            </div>
          </>
        )}
      </div>

      <aside className="hidden lg:block" aria-label="Registration summary">
        <div className="sticky top-24 space-y-3.5">
          <Summary childName={details.childName} program={program} weeks={selectedWeeks} lunch={lunch} quote={quote} />
          <div className="rounded-xl border border-[#121e34]/10 bg-white p-4 text-xs text-[#121e34]/70">
            <p className="font-playfair text-sm font-semibold text-[#121e34]">Questions?</p>
            <p className="mt-0.5 leading-relaxed">We&rsquo;re happy to help before you register.</p>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <a href={PHONE_TEL} className="inline-flex items-center gap-1.5 font-semibold text-[#1f4b50] hover:underline">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 break-all font-semibold text-[#1f4b50] hover:underline">
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}