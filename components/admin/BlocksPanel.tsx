"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlocksAdmin,
  fetchBlocksAdmin,
  fetchSchedule,
  removeBlockAdmin,
  removeBlockSeriesAdmin,
} from "@/lib/api";
import {
  groupBlocks,
  isOffered,
  kindOnDate,
  MAX_BLOCK_ADVANCE_DAYS,
  MAX_BLOCK_DATES,
  MAX_SERIES_WEEKS,
  seriesDates,
  sessionOptions,
  WEEK_ORDER,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  type BlockGroup,
  type BlockRecord,
  type SkippedBlock,
} from "@/lib/blocks";
import { BRAND, SESSION_LENGTHS } from "@/lib/booking";
import { addDays, describeSession, localDate } from "@/lib/schedule";
import type { PitchType, SessionLength } from "@/lib/types";

const PITCHES: { type: PitchType; label: string; hint: string }[] = [
  { type: "8Aside", label: "Whole pitch", hint: "8-a-side" },
  { type: "5Aside", label: "Half pitch", hint: "5-a-side" },
];

/** "Fri 20 Nov" */
function dayText(date: string): string {
  return localDate(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/** The date a blocked session really happens on: one after midnight is on the next calendar day. */
function whenText(b: BlockRecord): string {
  const when = describeSession(b.date, b.time);
  return dayText(when.date);
}

function Stat({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-1 border-r border-b border-[#121e34]/10 px-6 py-5 last:border-r-0 sm:border-b-0">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f4b50]/80">{label}</span>
      <span className="text-2xl font-extrabold leading-none tracking-tight" style={{ color: accent ?? "#121e34" }}>
        {value}
      </span>
      {sub && <span className="text-xs font-medium text-[#1f4b50]/80">{sub}</span>}
    </div>
  );
}

/** A radio button or a checkbox drawn as a pill; the real input stays in the page for keyboards and screen readers. */
function Choice({
  type,
  name,
  checked,
  onChange,
  disabled,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />
      <span className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#121e34]/15 bg-white px-4 text-[13px] font-bold text-[#1f4b50] transition-colors peer-checked:border-[#1f4b50] peer-checked:bg-[#1f4b50] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1f4b50] peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
        {children}
      </span>
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-[#121e34]/15 bg-white px-3.5 text-[13px] font-medium text-[#121e34] placeholder-[#6b7280] focus-visible:border-[#1f4b50] focus-visible:outline-2 focus-visible:outline-[#1f4b50]/30 disabled:opacity-60";
const labelClass = "mb-1.5 block text-xs font-semibold text-[#2c2825]/80";
const legendClass = "mb-1.5 text-xs font-semibold text-[#2c2825]/80";

export default function BlocksPanel() {
  const { font } = BRAND;
  const queryClient = useQueryClient();

  const [reason, setReason] = useState("");
  const [pitchType, setPitchType] = useState<PitchType>("8Aside");
  const [length, setLength] = useState<SessionLength>(120);
  const [timeRange, setTimeRange] = useState("");
  const [mode, setMode] = useState<"once" | "weekly">("once");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [weeks, setWeeks] = useState(4);
  const [search, setSearch] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [skipped, setSkipped] = useState<SkippedBlock[]>([]);
  const [confirming, setConfirming] = useState<string | null>(null); // "series:<id>" or "block:<id>"
  const [removeError, setRemoveError] = useState<string | null>(null);

  const { data: schedule, isError: scheduleFailed } = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
    staleTime: 5 * 60_000,
    retry: 2,
  });
  const {
    data: blocks,
    isError,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["admin-blocks"],
    queryFn: fetchBlocksAdmin,
    refetchInterval: 20_000,
  });
  const unknown = !blocks;

  const today = schedule?.today ?? "";
  const lastDay = today ? addDays(today, MAX_BLOCK_ADVANCE_DAYS) : "";
  const options = useMemo(() => (schedule ? sessionOptions(schedule, length) : []), [schedule, length]);
  // The chosen session, or the first one when the length has just changed.
  const time = options.some((o) => o.label === timeRange) ? timeRange : (options[0]?.label ?? "");
  const singleDate = date || today;
  const seriesStart = startDate || today;

  // What the form would block, and which of those dates the API will have to skip.
  const preview = useMemo(() => {
    if (!schedule || !time) return [];
    const dates = mode === "once" ? [singleDate] : seriesDates(seriesStart, weekdays, weeks);
    return dates
      .filter((d) => d)
      .map((d) => {
        const kind = kindOnDate(schedule, d);
        let problem: string | null = null;
        if (d < today) problem = "already passed";
        else if (d > lastDay) problem = `more than ${MAX_BLOCK_ADVANCE_DAYS} days ahead`;
        else if (!isOffered(schedule, kind, time)) problem = `no ${time} session on a ${kind}`;
        return { date: d, problem };
      });
  }, [schedule, time, mode, singleDate, seriesStart, weekdays, weeks, today, lastDay]);
  const blockable = preview.filter((p) => !p.problem).length;

  const create = useMutation({
    mutationFn: createBlocksAdmin,
    onSuccess: (result) => {
      const n = result.created.length;
      setReason("");
      setFormError(null);
      setSkipped(result.skipped);
      setNotice(
        `Blocked ${n} session${n === 1 ? "" : "s"} for ${result.created[0]?.reason ?? "them"}. Customers now see ${
          n === 1 ? "it" : "them"
        } as booked.`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin-blocks"] });
    },
    onError: (err: Error) => {
      setNotice(null);
      setSkipped([]);
      setFormError(err.message);
    },
  });

  const removeOne = useMutation({
    mutationFn: removeBlockAdmin,
    onSuccess: () => {
      setConfirming(null);
      setRemoveError(null);
      setSkipped([]);
      setNotice("Unblocked. Customers can book that session again.");
      queryClient.invalidateQueries({ queryKey: ["admin-blocks"] });
    },
    onError: (err: Error) => {
      setNotice(null);
      setRemoveError(err.message);
    },
  });

  const removeSeries = useMutation({
    mutationFn: removeBlockSeriesAdmin,
    onSuccess: (removed) => {
      setConfirming(null);
      setRemoveError(null);
      setSkipped([]);
      setNotice(`Unblocked ${removed} session${removed === 1 ? "" : "s"}. Customers can book them again.`);
      queryClient.invalidateQueries({ queryKey: ["admin-blocks"] });
    },
    onError: (err: Error) => {
      setNotice(null);
      setRemoveError(err.message);
    },
  });
  const removing = removeOne.isPending || removeSeries.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setSkipped([]);
    if (reason.trim().length < 2) return setFormError("Write who the session is for, so you can tell later.");
    if (!time) return setFormError("Choose a session time.");
    if (mode === "weekly" && weekdays.length === 0) return setFormError("Choose the days of the week the team plays.");
    if (preview.length > MAX_BLOCK_DATES) {
      return setFormError(`That is ${preview.length} sessions. Block at most ${MAX_BLOCK_DATES} at a time: shorten it to fewer weeks.`);
    }
    if (blockable === 0) return setFormError("None of those dates can be blocked at that time. See the list below.");
    setFormError(null);
    // Dates the API would skip anyway are not sent, so the report only lists the ones that were taken.
    create.mutate({
      reason: reason.trim(),
      pitchType,
      timeRange: time,
      dates: preview.filter((p) => !p.problem).map((p) => p.date),
    });
  };

  const groups = useMemo(() => groupBlocks(blocks ?? []), [blocks]);
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? groups.filter((g) => g.reason.toLowerCase().includes(q)) : groups;
  }, [groups, search]);

  const stats = useMemo(() => {
    const list = blocks ?? [];
    const weekEnd = today ? addDays(today, 6) : "";
    return {
      sessions: list.length,
      standing: groups.filter((g) => g.blocks.length > 1).length,
      thisWeek: today ? list.filter((b) => b.date >= today && b.date <= weekEnd).length : 0,
    };
  }, [blocks, groups, today]);

  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;
  const formDisabled = create.isPending || !schedule;

  return (
    <div style={{ fontFamily: font }}>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#121e34]">Blocked sessions</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-[#1f4b50]/80">
          A blocked session is taken off the booking page: customers see it as booked and cannot book it. Use it to hold a
          session for someone who is paying you first, or for a team that plays the same time every week.
          {updatedLabel && <> · Updated {updatedLabel}</>}
        </p>
      </div>

      {(isError || scheduleFailed) && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {isError
            ? "Couldn’t load the blocked sessions. Try again in a moment. If it keeps happening, sign out and back in, and check that the booking API is running and its ADMIN_API_KEY matches."
            : "Couldn’t load the session times, so nothing can be blocked right now. Try again in a moment."}
        </p>
      )}

      <form
        onSubmit={submit}
        noValidate
        className="mb-8 rounded-2xl border border-[#121e34]/10 bg-white p-5 shadow-sm"
        aria-labelledby="block-form-heading"
      >
        <h2 id="block-form-heading" className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#1f4b50]/80">
          Block a session
        </h2>

        <div className="grid gap-5">
          <div>
            <label htmlFor="block-reason" className={labelClass}>
              Who is it for?
            </label>
            <input
              id="block-reason"
              type="text"
              autoComplete="off"
              maxLength={80}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Brian, paying first, or Kibera Utd weekly"
              disabled={formDisabled}
              aria-invalid={formError ? true : undefined}
              aria-describedby={formError ? "block-form-error" : "block-reason-hint"}
              className={inputClass}
            />
            <p id="block-reason-hint" className="mt-1.5 text-xs font-medium text-[#1f4b50]/80">
              Only you see this. Customers just see the session as booked.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <fieldset disabled={formDisabled}>
              <legend className={legendClass}>How much of the pitch</legend>
              <div className="flex flex-wrap gap-2">
                {PITCHES.map((p) => (
                  <Choice key={p.type} type="radio" name="block-pitch" checked={pitchType === p.type} onChange={() => setPitchType(p.type)}>
                    {p.label}
                    <span className="text-[11px] font-semibold opacity-80">· {p.hint}</span>
                  </Choice>
                ))}
              </div>
            </fieldset>

            <fieldset disabled={formDisabled}>
              <legend className={legendClass}>How often</legend>
              <div className="flex flex-wrap gap-2">
                <Choice type="radio" name="block-mode" checked={mode === "once"} onChange={() => setMode("once")}>
                  One date
                </Choice>
                <Choice type="radio" name="block-mode" checked={mode === "weekly"} onChange={() => setMode("weekly")}>
                  Every week
                </Choice>
              </div>
            </fieldset>
          </div>

          <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
            <fieldset disabled={formDisabled}>
              <legend className={legendClass}>Session length</legend>
              <div className="flex gap-2">
                {SESSION_LENGTHS.map((l) => (
                  <Choice key={l.minutes} type="radio" name="block-length" checked={length === l.minutes} onChange={() => setLength(l.minutes)}>
                    {l.short}
                  </Choice>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="block-time" className={labelClass}>
                Time
              </label>
              <select
                id="block-time"
                value={time}
                onChange={(e) => setTimeRange(e.target.value)}
                disabled={formDisabled}
                className={inputClass}
              >
                {options.map((o) => (
                  <option key={o.label} value={o.label}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {mode === "once" ? (
            <div className="sm:max-w-xs">
              <label htmlFor="block-date" className={labelClass}>
                Date
              </label>
              <input
                id="block-date"
                type="date"
                value={singleDate}
                min={today || undefined}
                max={lastDay || undefined}
                onChange={(e) => setDate(e.target.value)}
                disabled={formDisabled}
                className={inputClass}
              />
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="block-start" className={labelClass}>
                    Starting
                  </label>
                  <input
                    id="block-start"
                    type="date"
                    value={seriesStart}
                    min={today || undefined}
                    max={lastDay || undefined}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={formDisabled}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="block-weeks" className={labelClass}>
                    For how many weeks
                  </label>
                  <select
                    id="block-weeks"
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    disabled={formDisabled}
                    className={inputClass}
                  >
                    {Array.from({ length: MAX_SERIES_WEEKS }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w}>
                        {w} week{w === 1 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <fieldset disabled={formDisabled}>
                <legend className={legendClass}>Days they play</legend>
                <div className="flex flex-wrap gap-2">
                  {WEEK_ORDER.map((d) => (
                    <Choice
                      key={d}
                      type="checkbox"
                      name="block-weekday"
                      checked={weekdays.includes(d)}
                      onChange={() => setWeekdays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]))}
                    >
                      <span aria-hidden="true">{WEEKDAY_SHORT[d]}</span>
                      <span className="sr-only">{WEEKDAY_NAMES[d]}</span>
                    </Choice>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {preview.length > 0 && (
            <div className="rounded-xl border border-[#121e34]/10 bg-[#F8F5F2] px-4 py-3">
              <p className="text-[13px] font-bold text-[#121e34]" aria-live="polite">
                {blockable === 0
                  ? "Nothing to block yet"
                  : `This will block ${blockable} session${blockable === 1 ? "" : "s"}`}
                {time && <span className="font-semibold text-[#1f4b50]/80"> · {time}</span>}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {preview.map((p) => (
                  <li
                    key={p.date}
                    title={p.problem ?? undefined}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.problem
                        ? "bg-[#121e34]/5 text-[#1f4b50]/60 line-through"
                        : "bg-[#88b03f]/20 text-[#3f6212]"
                    }`}
                  >
                    {dayText(p.date)}
                    {p.problem && <span className="sr-only"> (skipped: {p.problem})</span>}
                  </li>
                ))}
              </ul>
              {preview.some((p) => p.problem) && (
                <p className="mt-2 text-xs font-medium text-[#1f4b50]/90">
                  Crossed-out dates will be skipped: {[...new Set(preview.filter((p) => p.problem).map((p) => p.problem))].join("; ")}.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={formDisabled}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#88b03f] px-5 text-[13px] font-bold text-[#121e34] shadow-sm transition-colors hover:bg-[#769a35] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {create.isPending ? "Blocking…" : blockable > 1 ? `Block ${blockable} sessions` : "Block session"}
            </button>
            <p className="text-xs font-medium text-[#1f4b50]/80">
              Sessions that are already booked or blocked are skipped, never overwritten.
            </p>
          </div>
        </div>
        {formError && (
          <p id="block-form-error" role="alert" className="mt-3 text-[13px] font-medium text-red-700">
            {formError}
          </p>
        )}
      </form>

      <div aria-live="polite" className="mb-6 grid gap-3 empty:mb-0">
        {notice && (
          <p role="status" className="rounded-xl border border-[#00a64F]/25 bg-[#00a64F]/10 px-4 py-3 text-sm font-medium text-[#05632f]">
            {notice}
          </p>
        )}
        {skipped.length > 0 && (
          <div role="status" className="rounded-xl border border-[#b09100]/30 bg-[#fed107]/15 px-4 py-3 text-sm font-medium text-[#5c4b00]">
            <p className="font-bold">
              {skipped.length} date{skipped.length === 1 ? " was" : "s were"} skipped:
            </p>
            <ul className="mt-1 list-disc pl-5">
              {skipped.map((s) => (
                <li key={s.date}>
                  {dayText(s.date)}: {s.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#121e34]/10 bg-white shadow-sm sm:grid-cols-3">
        <Stat label="Blocked" value={unknown ? "–" : stats.sessions} sub="sessions coming up" />
        <Stat label="Standing slots" value={unknown ? "–" : stats.standing} sub="repeating every week" accent="#007a3a" />
        <Stat label="Next 7 days" value={unknown ? "–" : stats.thisWeek} sub="sessions held" accent="#7a6300" />
      </div>

      <div className="mb-4 flex justify-end">
        <label className="sr-only" htmlFor="block-search">
          Search blocked sessions
        </label>
        <input
          id="block-search"
          type="search"
          placeholder="Search who it is for…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#121e34]/10 bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#121e34] shadow-sm placeholder-[#6b7280] sm:w-64"
        />
      </div>

      {removeError && (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {removeError}
        </p>
      )}

      {unknown || rows.length === 0 ? (
        <p
          role="status"
          className="rounded-2xl border border-[#121e34]/10 bg-white px-6 py-16 text-center text-sm font-semibold text-[#1f4b50]/80 shadow-sm"
        >
          {unknown
            ? isError
              ? "Blocked sessions could not be loaded."
              : "Loading blocked sessions…"
            : groups.length === 0
              ? "Nothing is blocked. Every session is open to customers."
              : "No blocked sessions match your search."}
        </p>
      ) : (
        <ul className="grid gap-4">
          {rows.map((g) => (
            <GroupCard
              key={g.seriesId}
              group={g}
              confirming={confirming}
              setConfirming={(key) => {
                setRemoveError(null);
                setNotice(null);
                setConfirming(key);
              }}
              removing={removing}
              onRemoveOne={(id) => removeOne.mutate(id)}
              onRemoveSeries={(id) => removeSeries.mutate(id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function GroupCard({
  group,
  confirming,
  setConfirming,
  removing,
  onRemoveOne,
  onRemoveSeries,
}: {
  group: BlockGroup;
  confirming: string | null;
  setConfirming: (key: string | null) => void;
  removing: boolean;
  onRemoveOne: (id: string) => void;
  onRemoveSeries: (seriesId: string) => void;
}) {
  const many = group.blocks.length > 1;
  const first = group.blocks[0];
  const last = group.blocks[group.blocks.length - 1];
  const seriesKey = `series:${group.seriesId}`;

  return (
    <li className="rounded-2xl border border-[#121e34]/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="break-words text-[15px] font-extrabold text-[#121e34]">{group.reason}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#1f4b50]/90">
            <span
              className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold"
              style={
                group.pitchType === "8Aside"
                  ? { backgroundColor: "rgba(31,75,80,0.1)", color: "#1f4b50" }
                  : { backgroundColor: "rgba(136,176,63,0.2)", color: "#3f6212" }
              }
            >
              {group.pitchType === "8Aside" ? "Whole pitch" : "Half pitch"}
            </span>
            <span className="font-mono">{group.time}</span>
            {many && <span>· {group.weekdays.map((d) => WEEKDAY_SHORT[d]).join(", ")}</span>}
          </p>
          <p className="mt-2 text-[13px] font-bold text-[#121e34]">
            {many ? (
              <>
                {group.blocks.length} sessions · {whenText(first)} to {whenText(last)}
              </>
            ) : (
              <>
                {whenText(first)}
                {describeSession(first.date, first.time).caption && (
                  <span className="ml-2 text-xs font-semibold text-[#1f4b50]/80">
                    {describeSession(first.date, first.time).caption}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        <Confirm
          active={confirming === (many ? seriesKey : `block:${first.id}`)}
          question={many ? `Unblock all ${group.blocks.length} sessions?` : "Unblock this session?"}
          confirmLabel={many ? "Yes, unblock all" : "Yes, unblock"}
          idleLabel={many ? "Unblock all" : "Unblock"}
          srName={group.reason}
          removing={removing}
          onAsk={() => setConfirming(many ? seriesKey : `block:${first.id}`)}
          onCancel={() => setConfirming(null)}
          onConfirm={() => (many ? onRemoveSeries(group.seriesId) : onRemoveOne(first.id))}
        />
      </div>

      {many && (
        <details className="mt-4 border-t border-[#121e34]/10 pt-3">
          <summary className="cursor-pointer text-xs font-bold text-[#1f4b50] focus-visible:outline-2 focus-visible:outline-[#1f4b50]">
            Show the {group.blocks.length} dates
          </summary>
          <ul className="mt-2 divide-y divide-[#121e34]/5">
            {group.blocks.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-1.5">
                <span className="text-[13px] font-semibold text-[#121e34]">{whenText(b)}</span>
                <Confirm
                  active={confirming === `block:${b.id}`}
                  question="Unblock this date?"
                  confirmLabel="Yes, unblock"
                  idleLabel="Unblock"
                  srName={`${group.reason} on ${whenText(b)}`}
                  removing={removing}
                  onAsk={() => setConfirming(`block:${b.id}`)}
                  onCancel={() => setConfirming(null)}
                  onConfirm={() => onRemoveOne(b.id)}
                />
              </li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}

/** A button that asks "are you sure?" in place before it does anything. */
function Confirm({
  active,
  question,
  confirmLabel,
  idleLabel,
  srName,
  removing,
  onAsk,
  onCancel,
  onConfirm,
}: {
  active: boolean;
  question: string;
  confirmLabel: string;
  idleLabel: string;
  srName: string;
  removing: boolean;
  onAsk: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!active) {
    return (
      <button
        type="button"
        onClick={onAsk}
        className="min-h-9 rounded-lg px-3 text-xs font-bold text-[#a30500] transition-colors hover:bg-[#E10600]/10"
      >
        {idleLabel}
        <span className="sr-only"> {srName}</span>
      </button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center justify-end gap-2">
      <span className="text-xs font-semibold text-[#121e34]">{question}</span>
      <button
        type="button"
        onClick={onConfirm}
        disabled={removing}
        className="min-h-9 rounded-lg bg-[#E10600] px-3 text-xs font-bold text-white transition-colors hover:bg-[#b80500] disabled:opacity-60"
      >
        {removing ? "Unblocking…" : confirmLabel}
      </button>
      <button
        type="button"
        autoFocus // the safe choice, so a keyboard user does not lose their place or unblock by accident
        onClick={onCancel}
        disabled={removing}
        className="min-h-9 rounded-lg px-3 text-xs font-bold text-[#1f4b50] hover:bg-[#1f4b50]/10"
      >
        Cancel
      </button>
    </span>
  );
}
