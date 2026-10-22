"use client";

import { useEffect, useRef, type RefObject } from "react";
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
import {
  CAMP_DAYS_PER_WEEK,
  CAMP_PROGRAMS,
  CAMP_WEEKS,
  LUNCH_PER_DAY_KES,
  LUNCH_PER_WEEK_KES,
  WHAT_TO_EXPECT,
  formatKes,
  isWeekOpen,
  type CampProgramId,
  type CampQuote,
  type CampWeek,
} from "@/lib/camp";
import Summary from "./Summary";

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
  errorIsAboutDetails: boolean;
  isPaying: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onProgram: (id: CampProgramId) => void;
  onToggleWeek: (start: string) => void;
  onToggleAllWeeks: () => void;
  onLunch: (on: boolean) => void;
  onBack: () => void;
  onPay: () => void;
}

function SectionTitle({ n, children, id }: { n: number; children: React.ReactNode; id: string }) {
  return (
    <h3 id={id} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#121e34] sm:text-[13px]">
      <span
        aria-hidden="true"
        className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1f4b50] text-[10px] font-bold text-white"
      >
        {n}
      </span>
      {children}
    </h3>
  );
}

const CARD =
  "group/opt relative block cursor-pointer rounded-xl border border-[#121e34]/12 bg-white p-3 transition-all duration-150 hover:border-[#88b03f] has-checked:border-[#88b03f] has-checked:bg-[#88b03f]/[0.05] has-checked:ring-1 has-checked:ring-[#88b03f] has-focus-visible:ring-2 has-focus-visible:ring-[#1f4b50] has-focus-visible:ring-offset-1 has-focus-visible:outline-hidden has-disabled:cursor-not-allowed has-disabled:opacity-45 has-disabled:hover:border-[#121e34]/12";

const INPUT_COVER =
  "absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed";

function Tick({ shape }: { shape: "radio" | "box" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-4 w-4 shrink-0 items-center justify-center border border-[#1f4b50]/50 bg-white text-white transition-colors group-has-checked/opt:border-[#1f4b50] group-has-checked/opt:bg-[#1f4b50] ${
        shape === "radio" ? "rounded-full" : "rounded"
      } [&>svg]:scale-50 [&>svg]:opacity-0 [&>svg]:transition group-has-checked/opt:[&>svg]:scale-100 group-has-checked/opt:[&>svg]:opacity-100`}
    >
      <Check className="h-2.5 w-2.5" strokeWidth={4} />
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
  errorIsAboutDetails,
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
  const allSelected = openWeeks.length > 0 && openWeeks.every((w) => weeks.includes(w.start));
  const ready = !!program && weeks.length > 0;
  const firstName = childName.trim().split(" ")[0];

  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const publish = () => {
      if (getComputedStyle(bar).position === "sticky") root.style.setProperty("--camp-bar-h", `${bar.offsetHeight}px`);
      else root.style.removeProperty("--camp-bar-h");
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    window.addEventListener("resize", publish);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", publish);
      root.style.removeProperty("--camp-bar-h");
    };
  }, []);

  const payTone = isPaying
    ? "cursor-wait bg-[#88b03f] text-[#121e34]"
    : ready
      ? "bg-[#88b03f] text-[#121e34] hover:bg-[#769a35] active:scale-[0.99]"
      : "cursor-not-allowed bg-[#e7e5e4] text-[#57534e] shadow-none";

  return (
    <div className="camp-step-in">
      <button
        type="button"
        onClick={onBack}
        disabled={isPaying}
        className="-ml-2 mb-1.5 inline-flex h-7 items-center gap-1 rounded-full px-2 text-xs font-semibold text-[#1f4b50] transition-colors hover:bg-[#1f4b50]/8 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] disabled:opacity-50"
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to details
      </button>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-playfair text-lg font-semibold leading-tight text-[#121e34] outline-none sm:text-xl"
      >
        Choose your plan
      </h2>
      <p className="mt-1 break-words text-xs leading-relaxed text-[#121e34]/70 sm:text-[13px]">
        Pick a programme and the weeks {firstName || "your child"} will attend (Monday to Friday).
      </p>

      <div className="mt-4 space-y-5">
        <fieldset aria-labelledby="camp-program-title">
          <div className="mb-2">
            <SectionTitle n={1} id="camp-program-title">
              Programme
            </SectionTitle>
          </div>
          <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:gap-2.5">
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
                <span className="flex items-start justify-between gap-2">
                  <span>
                    <span className="block font-playfair text-sm font-semibold text-[#121e34] sm:text-[15px]">{prog.label}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-[#121e34]/65">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {prog.hours}
                    </span>
                  </span>
                  <Tick shape="radio" />
                </span>
                <span className="mt-2.5 block">
                  <span className="text-base font-bold tabular-nums text-[#121e34] sm:text-lg">{formatKes(prog.priceKes)}</span>
                  <span className="text-[11px] text-[#121e34]/65"> / wk</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset aria-labelledby="camp-weeks-title">
          <div className="mb-1 flex items-center justify-between gap-2">
            <SectionTitle n={2} id="camp-weeks-title">
              Weeks
            </SectionTitle>
            {openWeeks.length > 1 && (
              <button
                type="button"
                onClick={onToggleAllWeeks}
                disabled={isPaying}
                className="-mr-2 inline-flex h-7 items-center rounded-full px-2 text-[11px] font-semibold text-[#1f4b50] transition-colors hover:bg-[#1f4b50]/8 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] disabled:opacity-50"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            )}
          </div>
          <p className="mb-2 text-xs text-[#121e34]/65">Choose every week your child will attend.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {CAMP_WEEKS.map((w) => {
              const open = isWeekOpen(w, today);
              return (
                <label key={w.start} className={`${CARD} p-2.5`}>
                  <input
                    type="checkbox"
                    name="weeks"
                    value={w.start}
                    checked={weeks.includes(w.start)}
                    onChange={() => onToggleWeek(w.start)}
                    disabled={!open || isPaying}
                    className={INPUT_COVER}
                  />
                  <span className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1f4b50]">Wk {w.index}</span>
                    <Tick shape="box" />
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-semibold text-[#121e34]">{w.label}</span>
                  {!open && <span className="mt-0.5 block text-[10px] font-medium text-[#121e34]/55">Ended</span>}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset aria-labelledby="camp-lunch-title">
          <div className="mb-2">
            <SectionTitle n={3} id="camp-lunch-title">
              Lunch
            </SectionTitle>
          </div>
          <label className={CARD}>
            <input
              type="checkbox"
              name="lunch"
              checked={lunch}
              onChange={(e) => onLunch(e.target.checked)}
              disabled={isPaying}
              className={INPUT_COVER}
            />
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fed107]/20 text-[#6f5700]">
                <Utensils className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-[#121e34] sm:text-[13px]">Add daily camp lunch</span>
                <span className="mt-0.5 block text-[11px] text-[#121e34]/65">
                  {formatKes(LUNCH_PER_DAY_KES)}/day &middot; {formatKes(LUNCH_PER_WEEK_KES)}/wk ({CAMP_DAYS_PER_WEEK} days)
                </span>
              </span>
              <Tick shape="box" />
            </span>
          </label>
        </fieldset>

        <section aria-labelledby="camp-expect-title" className="rounded-xl bg-[#1f4b50] p-4 text-white">
          <h3 id="camp-expect-title" className="font-playfair text-sm font-semibold sm:text-base">
            What to expect
          </h3>
          <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {WHAT_TO_EXPECT.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <li
                  key={item.text}
                  className={`flex items-start gap-2 text-xs leading-snug ${i === WHAT_TO_EXPECT.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-[#88b03f]">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="pt-0.5 text-white/85">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="lg:hidden">
          <Summary childName={childName} program={program} weeks={selectedWeeks} lunch={lunch} quote={quote} />
        </div>
      </div>

      <div
        ref={barRef}
        className="sticky bottom-0 z-10 -mx-4 mt-5 border-t border-[#121e34]/10 bg-white/95 px-4 pb-3 pt-2.5 backdrop-blur-xs sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:pt-0 short:py-2 tiny:static"
      >
        {error && (
          <div
            role="alert"
            className="mb-2.5 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-2.5 text-xs text-red-800"
          >
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="break-words">{error}</p>
              {errorIsAboutDetails && (
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-1 inline-flex items-center font-semibold underline underline-offset-2 focus-visible:outline-hidden"
                >
                  Go back and check your details
                </button>
              )}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={isPaying ? undefined : onPay}
          disabled={!ready}
          aria-disabled={isPaying || undefined}
          aria-busy={isPaying || undefined}
          className={`flex h-10 w-full items-center justify-center gap-2 rounded-full px-4 text-center text-xs font-bold shadow-2xs transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f4b50] focus-visible:ring-offset-2 sm:h-11 sm:text-[13px] ${payTone}`}
        >
          {isPaying ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-[#121e34]/30 border-t-[#121e34]"
                aria-hidden="true"
              />
              Sending M-Pesa prompt…
            </>
          ) : ready ? (
            <span>
              Pay <span className="whitespace-nowrap">{formatKes(quote.total)}</span> with{" "}
              <span className="whitespace-nowrap">M-Pesa</span>
            </span>
          ) : (
            <span>Choose a programme and week to pay</span>
          )}
        </button>
        <p className={`mt-1.5 flex items-center justify-center gap-1 text-center text-[11px] text-[#121e34]/65 short:hidden ${error ? "hidden" : ""}`}>
          <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>
            M-Pesa prompt sent to <span className="whitespace-nowrap font-medium text-[#121e34]/80">{phoneLabel}</span>
          </span>
        </p>
      </div>
    </div>
  );
}