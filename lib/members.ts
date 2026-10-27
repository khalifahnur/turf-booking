// The member discount, as the booking page and the admin dashboard see it. The
// API decides who is a member and what they pay; nothing here knows a price.

import type { MemberQuote, Quote } from "./types";

/** A member on the list the admin keeps. */
export interface MemberRecord {
  id: string;
  fullName: string;
  /** 254712345678 */
  phoneNumber: string;
  createdAt: string;
  /** 8-a-side 2 hour sessions paid for in the current month. */
  sessions: number;
  /** The month's discount has been given. */
  discountUsed: boolean;
}

/** GET /admin/members: the list and the rule it applies. */
export interface MemberList {
  /** The current month, "2026-11". */
  month: string;
  percent: number;
  /** The session of the month the discount is given on: the 4th. */
  discountSession: number;
  members: MemberRecord[];
}

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isString = (v: unknown): v is string => typeof v === "string";

function isMemberQuote(v: unknown): v is MemberQuote {
  const m = v as Partial<MemberQuote> | null;
  return (
    !!m &&
    typeof m === "object" &&
    isNumber(m.percent) &&
    typeof m.applied === "boolean" &&
    isString(m.month) &&
    isNumber(m.sessions) &&
    isNumber(m.discountSession) &&
    typeof m.discountUsed === "boolean"
  );
}

/** Is this what POST /quote sends? Anything else is treated as "no price known". */
export function isQuote(v: unknown): v is Quote {
  const q = v as Partial<Quote> | null;
  return (
    !!q &&
    typeof q === "object" &&
    isNumber(q.amount) &&
    isNumber(q.listPrice) &&
    (q.member === undefined || isMemberQuote(q.member))
  );
}

export function isMemberList(v: unknown): v is MemberList {
  const l = v as Partial<MemberList> | null;
  return (
    !!l &&
    typeof l === "object" &&
    isString(l.month) &&
    isNumber(l.percent) &&
    isNumber(l.discountSession) &&
    Array.isArray(l.members) &&
    l.members.every(
      (m) =>
        !!m &&
        isString(m.id) &&
        isString(m.fullName) &&
        isString(m.phoneNumber) &&
        isString(m.createdAt) &&
        isNumber(m.sessions) &&
        typeof m.discountUsed === "boolean",
    )
  );
}

/** 1 to "1st", 2 to "2nd", 4 to "4th", 11 to "11th", 22 to "22nd". */
export function ordinal(n: number): string {
  const rest = n % 100;
  if (rest >= 11 && rest <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
}

/** "2026-11" to "November". */
export function monthName(month: string): string {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m) return month;
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long" });
}
