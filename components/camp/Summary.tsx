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
    <div className="flex items-start justify-between gap-4 text-[13px]">
      <dt className="shrink-0 text-[#121e34]/70">{label}</dt>
      <dd
        className={`min-w-0 break-words text-right font-semibold tabular-nums ${
          muted ? "text-[#121e34]/65" : "text-[#121e34]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

/** What the parent is about to pay for, worked out live as they choose. */
export default function Summary({ childName, program, weeks, lunch, quote }: SummaryProps) {
  // Rendered twice on step 2 (phone layout and side column), so the id cannot be fixed.
  const titleId = useId();
  const programInfo = CAMP_PROGRAMS.find((p) => p.id === program);
  const hasPlan = !!programInfo && weeks.length > 0;
  const weekWord = weeks.length === 1 ? "week" : "weeks";

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-3xl border border-[#121e34]/10 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(18,30,52,0.18)] sm:p-6"
    >
      <h3 id={titleId} className="font-playfair text-lg font-semibold text-[#121e34]">
        Your registration
      </h3>

      <dl className="mt-4 space-y-3">
        <Row label="Child" value={childName.trim() || "—"} muted={!childName.trim()} />
        <Row
          label="Programme"
          value={programInfo ? `${programInfo.label} · ${formatKes(programInfo.priceKes)}/wk` : "Not chosen yet"}
          muted={!programInfo}
        />
        <Row
          label="Weeks"
          value={
            !weeks.length
              ? "None chosen yet"
              : programInfo
                ? `${weeks.length} × ${formatKes(quote.programPerWeek)}`
                : `${weeks.length} ${weekWord}`
          }
          muted={!weeks.length}
        />
        {weeks.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Selected weeks">
            {weeks.map((w) => (
              <li key={w.start} className="rounded-full bg-[#1f4b50]/8 px-2.5 py-1 text-xs font-semibold text-[#1f4b50]">
                Wk {w.index} · {w.label}
              </li>
            ))}
          </ul>
        )}
        <Row
          label={
            <>
              Lunch
              <span className="block text-xs font-normal text-[#121e34]/65">
                {formatKes(LUNCH_PER_DAY_KES)} × {CAMP_DAYS_PER_WEEK} days
              </span>
            </>
          }
          value={lunch && weeks.length ? `${weeks.length} × ${formatKes(quote.lunchPerWeek)}` : lunch ? "Added" : "No"}
          muted={!lunch}
        />
      </dl>

      <div className="mt-5 flex flex-col items-start gap-1 border-t border-dashed border-[#121e34]/15 pt-4 min-[360px]:flex-row min-[360px]:items-end min-[360px]:justify-between min-[360px]:gap-3">
        <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em] text-[#121e34]/70">
          Total today
        </span>
        <span
          className="whitespace-nowrap font-playfair text-2xl font-bold tabular-nums text-[#121e34] min-[360px]:text-3xl"
          aria-live="polite"
          aria-atomic="true"
        >
          {hasPlan ? formatKes(quote.total) : "—"}
        </span>
      </div>
    </section>
  );
}
