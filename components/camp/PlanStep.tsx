"use client";

import type { RefObject } from "react";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  Clock,
  Dumbbell,
  Footprints,
  Gamepad2,
  Lock,
  Medal,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { KSH } from "@/lib/booking";
import {
  CAMP_DAYS_PER_WEEK,
  CAMP_PROGRAMS,
  CAMP_WEEKS,
  LUNCH_PER_DAY_KES,
  LUNCH_PER_WEEK_KES,
  WHAT_TO_EXPECT,
  isWeekOpen,
  type CampProgramId,
  type CampQuote,
} from "@/lib/camp";
import Summary from "./Summary";
import type { CampWeek } from "@/lib/camp";

const ICONS = {
  skills: Footprints,
  games: Gamepad2,
  coaching: Medal,
  fitness: Dumbbell,
  friends: ShieldCheck,
} as const;

interface PlanStepProps {
  today: string;
  childName: string;
  phoneLabel: string;
  program: CampProgramId | null;
  weeks: string[];
  lunch: boolean;
  quote: CampQuote;
  selectedWeeks: CampWeek[];
  error: string | null;
  isPaying: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onProgram: (id: CampProgramId) => void;
  onToggleWeek: (start: string) => void;
  onToggleAllWeeks: () => void;
  onLunch: (on: boolean) => void;
  onBack: () => void;
  onPay: () => void;
}

function SectionTitle({
  n,
  children,
  id,
}: {
  n: number;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <h3
      id={id}
      className="flex items-center gap-2.5 text-[15px] font-bold text-[#121e34]"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1f4b50] text-[11px] font-bold text-white">
        {n}
      </span>
      {children}
    </h3>
  );
}

/** Shared look of the selectable cards (programme, weeks, lunch). */
const CARD =
  "group/opt relative block cursor-pointer rounded-2xl border-2 border-[#121e34]/10 bg-white p-4 transition-all duration-200 hover:border-[#88b03f]/60 has-checked:border-[#88b03f] has-checked:bg-[#88b03f]/[0.07] has-focus-visible:ring-2 has-focus-visible:ring-[#1f4b50] has-focus-visible:ring-offset-2 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:hover:border-[#121e34]/10";

/**
 * The real radio/checkbox, stretched invisibly over its whole card. Covering the
 * card (rather than hiding a 1px input in its corner) means that when a keyboard
 * user tabs to it the browser scrolls the entire card into view, clear of the
 * sticky pay bar, and a tap anywhere on the card lands on the input itself.
 */
const INPUT_COVER =
  "absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed";

function Tick({ shape }: { shape: "radio" | "box" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 border-[#1f4b50]/30 bg-white text-white transition-colors group-has-checked/opt:border-[#88b03f] group-has-checked/opt:bg-[#88b03f] ${
        shape === "radio" ? "rounded-full" : "rounded-md"
      } [&>svg]:scale-50 [&>svg]:opacity-0 [&>svg]:transition group-has-checked/opt:[&>svg]:scale-100 group-has-checked/opt:[&>svg]:opacity-100`}
    >
      <Check className="h-3 w-3" strokeWidth={4} />
    </span>
  );
}

export default function PlanStep({
  today,
  childName,
  phoneLabel,
  program,
  weeks,
  lunch,
  quote,
  selectedWeeks,
  error,
  isPaying,
  headingRef,
  onProgram,
  onToggleWeek,
  onToggleAllWeeks,
  onLunch,
  onBack,
  onPay,
}: PlanStepProps) {
  const openWeeks = CAMP_WEEKS.filter((w) => isWeekOpen(w, today));
  const allSelected =
    openWeeks.length > 0 && openWeeks.every((w) => weeks.includes(w.start));
  const ready = !!program && weeks.length > 0;

  return (
    <div className="camp-step-in">
      <button
        type="button"
        onClick={onBack}
        disabled={isPaying}
        className="-ml-1 mb-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-[#1f4b50] transition-colors hover:bg-[#1f4b50]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back to details
      </button>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-playfair text-2xl font-semibold leading-tight text-[#121e34] outline-none sm:text-[1.7rem]"
      >
        Choose your plan
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#121e34]/65">
        Pick a programme and the weeks{" "}
        {childName.trim() ? childName.trim().split(" ")[0] : "your child"} will
        attend. The camp runs Monday to Friday.
      </p>

      <div className="mt-7 space-y-8">
        <fieldset>
          <legend className="mb-3">
            <SectionTitle n={1} id="camp-program-title">
              Programme
            </SectionTitle>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {CAMP_PROGRAMS.map((prog) => (
              <label key={prog.id} className={CARD}>
                <input
                  type="radio"
                  name="program"
                  value={prog.id}
                  checked={program === prog.id}
                  onChange={() => onProgram(prog.id)}
                  disabled={isPaying}
                  className={INPUT_COVER}
                />
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-playfair text-lg font-semibold text-[#121e34]">
                      {prog.label}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-[13px] text-[#121e34]/65">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {prog.hours}
                    </span>
                  </span>
                  <Tick shape="radio" />
                </span>
                <span className="mt-4 block">
                  <span className="text-2xl font-bold tabular-nums text-[#121e34]">
                    {KSH(prog.priceKes)}
                  </span>
                  <span className="text-sm text-[#121e34]/55"> / week</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1 w-full">
            <span className="flex flex-wrap items-center justify-between gap-2">
              <SectionTitle n={2} id="camp-weeks-title">
                Weeks
              </SectionTitle>
              {openWeeks.length > 1 && (
                <button
                  type="button"
                  onClick={onToggleAllWeeks}
                  disabled={isPaying}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-[#1f4b50] underline-offset-2 transition-colors hover:bg-[#1f4b50]/8 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] disabled:opacity-50"
                >
                  {allSelected ? "Clear all" : "Select all weeks"}
                </button>
              )}
            </span>
          </legend>
          <p className="mb-3 text-[13px] text-[#121e34]/55">
            Choose every week your child will attend.
          </p>
          <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:grid-cols-3 sm:gap-3">
            {CAMP_WEEKS.map((w) => {
              const open = isWeekOpen(w, today);
              return (
                <label key={w.start} className={`${CARD} p-3.5`}>
                  <input
                    type="checkbox"
                    name="weeks"
                    value={w.start}
                    checked={weeks.includes(w.start)}
                    onChange={() => onToggleWeek(w.start)}
                    disabled={!open || isPaying}
                    className={INPUT_COVER}
                  />
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1f4b50]/70">
                      Week {w.index}
                    </span>
                    <Tick shape="box" />
                  </span>
                  <span className="mt-1 block whitespace-nowrap text-[15px] font-semibold text-[#121e34]">
                    {w.label}
                  </span>
                  {!open && (
                    <span className="mt-1 block text-[11px] font-semibold text-[#121e34]/50">
                      Ended
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3">
            <SectionTitle n={3} id="camp-lunch-title">
              Lunch
            </SectionTitle>
          </legend>
          <label className={CARD}>
            <input
              type="checkbox"
              name="lunch"
              checked={lunch}
              onChange={(e) => onLunch(e.target.checked)}
              disabled={isPaying}
              className={INPUT_COVER}
            />
            <span className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fed107]/25 text-[#8a6d00]">
                <Utensils className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-[#121e34]">
                  Add lunch for every camp day
                </span>
                <span className="mt-0.5 block text-[13px] text-[#121e34]/60">
                  {KSH(LUNCH_PER_DAY_KES)} a day &middot;{" "}
                  {KSH(LUNCH_PER_WEEK_KES)} a week ({CAMP_DAYS_PER_WEEK} days)
                </span>
              </span>
              <Tick shape="box" />
            </span>
          </label>
        </fieldset>

        <section
          aria-labelledby="camp-expect-title"
          className="rounded-3xl bg-[#1f4b50] p-5 text-white sm:p-6"
        >
          <h3
            id="camp-expect-title"
            className="font-playfair text-xl font-semibold"
          >
            What to expect
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {WHAT_TO_EXPECT.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <li
                  key={item.text}
                  className={`flex items-start gap-3 text-sm leading-snug ${i === WHAT_TO_EXPECT.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12 text-[#88b03f]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="pt-1 text-white/90">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* On large screens the summary lives in the side column instead. */}
        <div className="lg:hidden">
          <Summary
            childName={childName}
            program={program}
            weeks={selectedWeeks}
            lunch={lunch}
            quote={quote}
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      {/* Stays at the bottom of the screen on phones so the total and the pay
          button are always in reach while the long form scrolls past. */}
      <div className="sticky bottom-0 z-10 -mx-5 mt-8 border-t border-[#121e34]/10 bg-white px-5 pb-4 pt-3 shadow-[0_-10px_24px_-14px_rgba(18,30,52,0.25)] sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:pt-0 lg:shadow-none">
        <button
          type="button"
          onClick={onPay}
          disabled={!ready || isPaying}
          className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#88b03f] px-4 py-2 text-center text-[14px] font-bold leading-tight text-white sm:px-6 sm:text-[15px] shadow-md transition-all duration-300 hover:bg-[#769a35] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none"
        >
          {isPaying ? (
            <>
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              Sending M-Pesa prompt…
            </>
          ) : ready ? (
            <span>
              Pay <span className="whitespace-nowrap">{KSH(quote.total)}</span>{" "}
              with <span className="whitespace-nowrap">M-Pesa</span>
            </span>
          ) : (
            <span>Choose a programme and a week to pay</span>
          )}
        </button>
        <p className="mt-2.5 flex items-start justify-center gap-1.5 text-center text-xs text-[#121e34]/55">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          <span>
            An <span className="whitespace-nowrap">M-Pesa</span> prompt will be
            sent to <span className="whitespace-nowrap">{phoneLabel}</span>.
            Payments are processed securely.
          </span>
        </p>
      </div>
    </div>
  );
}
