// The booking calendar. The server decides which days can be booked, which
// opening hours each day has (weekdays, weekends and Kenyan public holidays
// differ) and which sessions that gives; this file only reads what it sends and
// works out what is still open right now. Nothing here knows an opening hour.

import type { DayInfo, DayKind, SessionLength, TimeSlot } from "./types";

export interface ScheduleSession {
  minutes: number;
  start: string;
  end: string;
  label: string;
  from: number;
  to: number;
}

export interface ScheduleWindow {
  open: string;
  close: string;
  from: number;
  to: number;
}

export interface ScheduleKind {
  windows: ScheduleWindow[];
  sessions: ScheduleSession[];
}

export interface ScheduleDay {
  date: string;
  kind: DayKind;
  holiday?: string;
}

/** GET /api/v1/schedule */
export interface Schedule {
  timezone: string;
  today: string;
  minRemainingMinutes: number;
  kinds: Record<DayKind, ScheduleKind>;
  days: ScheduleDay[];
}

export const MINUTES_PER_DAY = 24 * 60;

// A session belongs to the operating day it starts on, and times within it are
// minutes after that day's midnight, so the late sessions pass 1440. These two
// constants say how a stored "HH:MM – HH:MM" is read, and must stay equal to
// dayRollover and maxWrapped in the API's schedule package.

/** A clock time before this is in the early hours after the operating day's midnight. */
export const DAY_ROLLOVER = 5 * 60;
/** The longest range a stored row may have if it runs past midnight. */
export const MAX_WRAPPED = 4 * 60;

/** "16:00 – 18:00" (or with a plain hyphen) to minutes on the operating day's own clock. */
export function parseRange(range: string): [number, number] | null {
  // Rows come from the API untyped; a missing time is simply unreadable.
  if (typeof range !== "string") return null;
  const parts = range.replace(/[–—−]/g, "-").split("-");
  if (parts.length !== 2) return null;
  const toMinutes = (s: string) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
    if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
    return Number(m[1]) * 60 + Number(m[2]);
  };
  const from = toMinutes(parts[0]);
  const to = toMinutes(parts[1]);
  if (from === null || to === null) return null;

  // An ordinary range within the day, as every row written before late opening is.
  if (to > from && from >= DAY_ROLLOVER) return [from, to];

  const start = from < DAY_ROLLOVER ? from + MINUTES_PER_DAY : from;
  let end = to;
  while (end <= start) end += MINUTES_PER_DAY;
  return end - start <= MAX_WRAPPED ? [start, end] : null;
}

// ---- dates ------------------------------------------------------------------
// Plain calendar arithmetic on YYYY-MM-DD strings (via UTC), so the visitor's own
// timezone can never shift a date.

function parts(date: string): [number, number, number] {
  const [y, m, d] = String(date).split("-").map(Number);
  return [y, m, d];
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = parts(date);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = parts(from);
  const [ty, tm, td] = parts(to);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000);
}

/** A local-midnight Date for a YYYY-MM-DD string, for weekday and month names. */
export function localDate(date: string): Date {
  const [y, m, d] = parts(date);
  return new Date(y, m - 1, d);
}

// ---- the venue's clock -------------------------------------------------------

export interface VenueClock {
  /** The venue's calendar date, YYYY-MM-DD. */
  date: string;
  /** Minutes since that date's midnight, with seconds as a fraction. */
  minutes: number;
}

export const VENUE_TIMEZONE = "Africa/Nairobi";

/** The time at the venue, whatever timezone the visitor's device is set to. */
export function venueClock(now: Date, timeZone: string = VENUE_TIMEZONE): VenueClock {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(f.find((p) => p.type === type)?.value ?? 0);
  return {
    date: `${String(get("year")).padStart(4, "0")}-${String(get("month")).padStart(2, "0")}-${String(get("day")).padStart(2, "0")}`,
    minutes: get("hour") * 60 + get("minute") + get("second") / 60,
  };
}

/** How far past midnight the latest closing time reaches, from the schedule itself. */
export function closeSpill(schedule: Schedule): number {
  let latest = MINUTES_PER_DAY;
  for (const kind of Object.values(schedule.kinds)) {
    for (const w of kind.windows) latest = Math.max(latest, w.to);
  }
  return latest - MINUTES_PER_DAY;
}

/** The date of the operating day under way: yesterday until the venue closes in the early hours. */
export function operatingDate(clock: VenueClock, spill: number): string {
  return clock.minutes < spill ? addDays(clock.date, -1) : clock.date;
}

// ---- days and sessions ---------------------------------------------------------

/** The date of the operating day under way at `now`. */
export function currentOperatingDate(schedule: Schedule, now: Date): string {
  return operatingDate(venueClock(now, schedule.timezone), closeSpill(schedule));
}

/** The days that can still be booked, from `first` (the operating day) on. */
export function buildDays(schedule: Schedule, first: string): DayInfo[] {
  return schedule.days
    .filter((d) => d.date >= first)
    .map((d) => {
      const dateObj = localDate(d.date);
      const dow = dateObj.getDay();
      return {
        dateObj,
        dayName: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: dateObj.getDate(),
        monthName: dateObj.toLocaleDateString("en-US", { month: "short" }),
        fullDateStr: d.date,
        isWeekend: dow === 0 || dow === 6,
        kind: d.kind,
        holiday: d.holiday || undefined,
      };
    });
}

/** Every session a kind of day offers at one length. */
export function slotsFor(schedule: Schedule, kind: DayKind, minutes: SessionLength): TimeSlot[] {
  return (schedule.kinds[kind]?.sessions ?? [])
    .filter((s) => s.minutes === minutes)
    .map((s) => ({ timeRange: s.label, startTime: s.start, minutes, from: s.from, to: s.to }));
}

/**
 * Can the session still be booked? The server stops taking a session when less
 * than `minRemaining` minutes of it are left.
 */
export function isSlotOpen(slot: TimeSlot, date: string, clock: VenueClock, minRemaining: number): boolean {
  const sinceMidnight = daysBetween(date, clock.date) * MINUTES_PER_DAY + clock.minutes;
  return slot.to - sinceMidnight >= minRemaining;
}

// ---- wording ----------------------------------------------------------------------

/** Minutes on the operating day's clock as "HH:MM", wrapping past midnight. */
export function clockOf(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** "07:00" to "7am", "15:30" to "3:30pm", "01:00" to "1am", "00:00" to "12am". */
export function clock12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h % 24 >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

/** "7am – 9am and 3pm – 1am". */
export function formatWindows(windows: ScheduleWindow[]): string {
  return windows.map((w) => `${clock12(w.open)} – ${clock12(w.close)}`).join(" and ");
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface SessionWhen {
  /** The date the session actually takes place on (the next day, for one after midnight). */
  date: string;
  /** "Sat, Nov 7" */
  dateText: string;
  /** The time range as booked. */
  timeText: string;
  /** What to tell the customer when the session is not simply "that date, those hours". */
  note?: string;
  /** The same in a few words, for under a session's time in a list. */
  caption?: string;
  /** The session starts after midnight, on the day after the one it is booked under. */
  startsNextDay: boolean;
  /** The session runs past midnight (including one that starts after it). */
  pastMidnight: boolean;
}

/**
 * Words a booking the way a customer expects to read it. Bookings are stored
 * against the day their evening begins, so the last hour of a Friday ("00:00 –
 * 01:00") happens on Saturday's calendar date, and the page says so.
 */
export function describeSession(date: string, range: string): SessionWhen {
  const bounds = parseRange(range);
  const [from, to] = bounds ?? [0, 0];
  const startsNextDay = from >= MINUTES_PER_DAY;
  const pastMidnight = to > MINUTES_PER_DAY;
  const actual = startsNextDay ? addDays(date, 1) : date;
  const shown = localDate(actual).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  let note: string | undefined;
  let caption: string | undefined;
  if (startsNextDay) {
    note = `Just after midnight, late ${WEEKDAYS[localDate(date).getDay()]} night`;
    caption = `Early ${WEEKDAYS[localDate(actual).getDay()]} morning`;
  } else if (pastMidnight) {
    note = `Ends ${clock12(clockOf(to))} ${WEEKDAYS[localDate(addDays(date, 1)).getDay()]}`;
    caption = note;
  }
  return { date: actual, dateText: shown, timeText: range, note, caption, startsNextDay, pastMidnight };
}
