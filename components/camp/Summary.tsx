import { KSH } from "@/lib/booking";
import { CAMP_PROGRAMS, CAMP_DAYS_PER_WEEK, LUNCH_PER_DAY_KES, type CampProgramId, type CampQuote, type CampWeek } from "@/lib/camp";

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
      <dt className={muted ? "text-[#121e34]/45" : "text-[#121e34]/70"}>{label}</dt>
      <dd className={`text-right font-semibold tabular-nums ${muted ? "text-[#121e34]/45" : "text-[#121e34]"}`}>{value}</dd>
    </div>
  );
}

/** What the parent is about to pay for, worked out live as they choose. */
export default function Summary({ childName, program, weeks, lunch, quote }: SummaryProps) {
  const programInfo = CAMP_PROGRAMS.find((p) => p.id === program);
  const hasPlan = !!programInfo && weeks.length > 0;

  return (
    <section
      aria-labelledby="camp-summary-title"
      className="rounded-3xl border border-[#121e34]/10 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(18,30,52,0.18)] sm:p-6"
    >
      <h3 id="camp-summary-title" className="font-playfair text-lg font-semibold text-[#121e34]">
        Your registration
      </h3>

      <dl className="mt-4 space-y-3">
        <Row label="Child" value={childName.trim() || "—"} muted={!childName.trim()} />
        <Row
          label="Programme"
          value={programInfo ? `${programInfo.label} · ${KSH(programInfo.priceKes)}/wk` : "Not chosen yet"}
          muted={!programInfo}
        />
        <Row
          label="Weeks"
          value={weeks.length ? `${weeks.length} × ${KSH(quote.programPerWeek)}` : "None chosen yet"}
          muted={!weeks.length}
        />
        {weeks.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Selected weeks">
            {weeks.map((w) => (
              <li key={w.start} className="rounded-full bg-[#1f4b50]/8 px-2.5 py-1 text-[11px] font-semibold text-[#1f4b50]">
                Wk {w.index} · {w.label}
              </li>
            ))}
          </ul>
        )}
        <Row
          label={
            <>
              Lunch
              <span className="block text-[11px] text-[#121e34]/45">
                {KSH(LUNCH_PER_DAY_KES)} × {CAMP_DAYS_PER_WEEK} days
              </span>
            </>
          }
          value={lunch && weeks.length ? `${weeks.length} × ${KSH(quote.lunchPerWeek)}` : lunch ? "Added" : "No"}
          muted={!lunch}
        />
      </dl>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-dashed border-[#121e34]/15 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#121e34]/60">Total today</span>
        <span
          className="font-playfair text-3xl font-bold tabular-nums text-[#121e34]"
          aria-live="polite"
          aria-atomic="true"
        >
          {hasPlan ? KSH(quote.total) : "—"}
        </span>
      </div>
    </section>
  );
}
