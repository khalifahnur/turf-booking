// Sessions the admin has blocked, as the dashboard sees them. The API decides what
// can be blocked and whether a date is free; nothing here knows an opening hour or
// a price. This file only reads what the API sends, builds the list of dates a
// request names, and groups the blocks for display.

import { addDays, localDate, type Schedule } from "./schedule";
import type { DayKind, PitchType } from "./types";

/** One blocked session, from GET /admin/blocks. */
export interface BlockRecord {
  id: string;
  /** The operating day the session belongs to, YYYY-MM-DD. */
  date: string;
  /** "19:00 – 21:00" */
  time: string;
  /** "8Aside" holds the whole pitch, "5Aside" one half. */
  pitchType: PitchType;
  /** The admin's note on who it is for. Never shown to customers. */
  reason: string;
  /** Ties together the sessions made by one request. */
  seriesId: string;
  createdAt: string;
}

/** A date that could not be blocked, and why, in words for the admin. */
export interface SkippedBlock {
  date: string;
  reason: string;
}

/** What POST /admin/blocks answers: what was blocked, and what was not. */
export interface BlockResult {
  created: BlockRecord[];
  skipped: SkippedBlock[];
}

/** What POST /admin/blocks takes: one session, on each of these dates. */
export interface BlockRequest {
  reason: string;
  pitchType: PitchType;
  timeRange: string;
  dates: string[];
}

/** The most dates one request may name; the API refuses more. */
export const MAX_BLOCK_DATES = 100;
/** How far ahead a session can be blocked, in days; the API refuses further. */
export const MAX_BLOCK_ADVANCE_DAYS = 180;
/** The longest series the form offers, in weeks. */
export const MAX_SERIES_WEEKS = 12;

const isString = (v: unknown): v is string => typeof v === "string";

function isBlockRecord(v: unknown): v is BlockRecord {
  const b = v as Partial<BlockRecord> | null;
  return (
    !!b &&
    typeof b === "object" &&
    isString(b.id) &&
    isString(b.date) &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    isString(b.time) &&
    (b.pitchType === "5Aside" || b.pitchType === "8Aside") &&
    isString(b.reason) &&
    isString(b.seriesId) &&
    isString(b.createdAt)
  );
}

/** Is this what GET /admin/blocks sends? */
export function isBlockList(v: unknown): v is { blocks: BlockRecord[] } {
  const l = v as { blocks?: unknown } | null;
  return !!l && typeof l === "object" && Array.isArray(l.blocks) && l.blocks.every(isBlockRecord);
}

/** Is this what POST /admin/blocks sends back? */
export function isBlockResult(v: unknown): v is BlockResult {
  const r = v as Partial<BlockResult> | null;
  return (
    !!r &&
    typeof r === "object" &&
    Array.isArray(r.created) &&
    r.created.every(isBlockRecord) &&
    Array.isArray(r.skipped) &&
    r.skipped.every((s) => !!s && isString(s.date) && isString(s.reason))
  );
}

// ---- the dates of a request ------------------------------------------------------

export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/** The order the form lists the days in: the week as it is lived here, Monday first. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

/**
 * The dates of a team's standing slot: each chosen weekday (0 is Sunday) in the
 * `weeks` weeks that start on `start`. Weekdays are read from the calendar date
 * itself, so the browser's timezone cannot shift them.
 */
export function seriesDates(start: string, weekdays: number[], weeks: number): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || weekdays.length === 0 || weeks < 1) return [];
  const wanted = new Set(weekdays);
  const out: string[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const date = addDays(start, i);
    if (wanted.has(localDate(date).getDay())) out.push(date);
  }
  return out;
}

/** The kind of day a date is, when the calendar says (it covers a month); otherwise by weekday. */
export function kindOnDate(schedule: Schedule, date: string): DayKind {
  const known = schedule.days.find((d) => d.date === date);
  if (known) return known.kind;
  const dow = localDate(date).getDay();
  return dow === 0 || dow === 6 ? "weekend" : "weekday";
}

/**
 * The sessions of one length that any kind of day offers, in time order, without
 * repeats. A team's slot can span weekdays and weekends, so the form offers all of
 * them and the API skips the dates a session is not offered on.
 */
export function sessionOptions(schedule: Schedule, minutes: number): { label: string; from: number }[] {
  const seen = new Map<string, number>();
  for (const kind of Object.values(schedule.kinds)) {
    for (const s of kind.sessions) {
      if (s.minutes === minutes && !seen.has(s.label)) seen.set(s.label, s.from);
    }
  }
  return [...seen.entries()].map(([label, from]) => ({ label, from })).sort((a, b) => a.from - b.from);
}

/** Does this kind of day offer the session? Dates that fail this are skipped by the API. */
export function isOffered(schedule: Schedule, kind: DayKind, label: string): boolean {
  return schedule.kinds[kind]?.sessions.some((s) => s.label === label) ?? false;
}

// ---- the list ----------------------------------------------------------------------

/** The blocks made by one request: one session, or a team's standing slot. */
export interface BlockGroup {
  seriesId: string;
  reason: string;
  pitchType: PitchType;
  time: string;
  /** In date order. */
  blocks: BlockRecord[];
  /** The weekdays it falls on (0 is Sunday), in the order the form lists them. */
  weekdays: number[];
}

/**
 * Groups blocks by the request that made them, earliest first. Blocks are listed
 * one to a request when a request made only one, so a lone session is a group of
 * one and a team's slot is a group of many.
 */
export function groupBlocks(blocks: BlockRecord[]): BlockGroup[] {
  const bySeries = new Map<string, BlockRecord[]>();
  for (const b of blocks) {
    const list = bySeries.get(b.seriesId);
    if (list) list.push(b);
    else bySeries.set(b.seriesId, [b]);
  }
  const groups: BlockGroup[] = [];
  for (const [seriesId, list] of bySeries) {
    const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0];
    const days = new Set(sorted.map((b) => localDate(b.date).getDay()));
    groups.push({
      seriesId,
      reason: first.reason,
      pitchType: first.pitchType,
      time: first.time,
      blocks: sorted,
      weekdays: WEEK_ORDER.filter((d) => days.has(d)),
    });
  }
  return groups.sort((a, b) => a.blocks[0].date.localeCompare(b.blocks[0].date) || a.reason.localeCompare(b.reason));
}
