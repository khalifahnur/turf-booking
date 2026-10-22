import { useId } from "react";
import {
  CAMP_DAYS_PER_WEEK,
  CAMP_PROGRAMS,
  LUNCH_PER_DAY_KES,
  formatKes,
  type CampProgramId,
  type CampQuote,
  type CampWeek,
} from "@/lib/camp";

interface SummaryProps {
  childName: string;
  program: CampProgramId | null;
  weeks: CampWeek[];
  lunch: boolean;
  quote: CampQuote;
}

function Row({ label, value, muted }: { label: React.ReactNode; value: React.ReactNode; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <dt className="shrink-0 text-[#121e34]/65">{label}</dt>
      <dd
        className={`min-w-0 break-words text-right font-semibold tabular-nums ${
          muted ? "text-[#121e34]/50" : "text-[#121e34]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function Summary({ childName, program, weeks, lunch, quote }: SummaryProps) {
  const titleId = useId();
  const programInfo = CAMP_PROGRAMS.find((p) => p.id === program);
  const hasPlan = !!programInfo && weeks.length > 0;
  const weekWord = weeks.length === 1 ? "week" : "weeks";

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-xl border border-[#121e34]/10 bg-white p-4 shadow-2xs"
    >
      <h3 id={titleId} className="font-playfair text-sm font-semibold text-[#121e34] sm:text-[15px]">
        Your registration
      </h3>

      <div className="mt-3 space-y-2">
        <dl className="space-y-2">
          <Row label="Child Name" value={childName.trim() || "—"} muted={!childName.trim()} />
          <Row
            label="Programme"
            value={programInfo ? `${programInfo.label} · ${formatKes(programInfo.priceKes)}/wk` : "Not chosen"}
            muted={!programInfo}
          />
          <Row
            label="Weeks"
            value={
              !weeks.length
                ? "None chosen"
                : programInfo
                  ? `${weeks.length} × ${formatKes(quote.programPerWeek)}`
                  : `${weeks.length} ${weekWord}`
            }
            muted={!weeks.length}
          />
        </dl>
        {weeks.length > 0 && (
          <ul className="flex flex-wrap gap-1 pt-0.5" aria-label="Selected weeks">
            {weeks.map((w) => (
              <li key={w.start} className="rounded-md bg-[#1f4b50]/8 px-2 py-0.5 text-[11px] font-medium text-[#1f4b50]">
                Wk {w.index} · {w.label}
              </li>
            ))}
          </ul>
        )}
        <dl className="pt-0.5">
          <Row
            label={
              <>
                Lunch
                <span className="block text-[11px] font-normal text-[#121e34]/55">
                  {formatKes(LUNCH_PER_DAY_KES)} × {CAMP_DAYS_PER_WEEK}d
                </span>
              </>
            }
            value={lunch && weeks.length ? `${weeks.length} × ${formatKes(quote.lunchPerWeek)}` : lunch ? "Added" : "No"}
            muted={!lunch}
          />
        </dl>
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-2 border-t border-dashed border-[#121e34]/12 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#121e34]/65">
          Total today
        </span>
        <span
          className="font-playfair text-lg font-bold tabular-nums text-[#121e34] sm:text-xl"
          aria-live="polite"
          aria-atomic="true"
        >
          {hasPlan ? formatKes(quote.total) : "—"}
        </span>
      </div>
    </section>
  );
}