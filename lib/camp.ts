// Holiday camp: dates, prices, wording. The booking API enforces the same rules
// and works out every amount itself, so this file can only ever be out of date,
// never be used to change what someone is charged.

/**
 * Identifies the terms text below. It is sent with the registration and the
 * server refuses any other value, so agreement is only ever recorded against
 * the wording that was actually shown. Change it together with CAMP_TERMS and
 * with TermsVersion in the Go API (internal/camp/camp.go).
 */
export const CAMP_TERMS_VERSION = "camp-2026-v1";

export const CAMP_NAME = "Holiday Football Camp";
export const CAMP_FIRST_DAY = "2026-11-02"; // a Monday
export const CAMP_LAST_DAY = "2026-12-18"; // a Friday
export const CAMP_DATES_LABEL = "2 Nov – 18 Dec 2026";

export type CampProgramId = "fullDay" | "halfDay";

export interface CampProgram {
  id: CampProgramId;
  label: string;
  hours: string;
  priceKes: number; // per week
}

export const CAMP_PROGRAMS: CampProgram[] = [
  { id: "fullDay", label: "Full day", hours: "8:30am – 4:00pm", priceKes: 2_500 },
  { id: "halfDay", label: "Half day", hours: "8:30am – 12:30pm", priceKes: 1_500 },
];

export const LUNCH_PER_DAY_KES = 100;
export const CAMP_DAYS_PER_WEEK = 5;
export const LUNCH_PER_WEEK_KES = LUNCH_PER_DAY_KES * CAMP_DAYS_PER_WEEK;

export const WHAT_TO_EXPECT = [
  { icon: "skills", text: "Football skills training" },
  { icon: "games", text: "Fun games and matches" },
  { icon: "coaching", text: "Professional coaching" },
  { icon: "fitness", text: "Fitness and discipline" },
  { icon: "friends", text: "New friendships in a safe and supportive environment" },
] as const;

// ---- weeks -----------------------------------------------------------------
// Plain calendar arithmetic on YYYY-MM-DD strings (via UTC), so a visitor's
// timezone can never shift a date.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDay(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDay(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function addDays(s: string, days: number): string {
  const d = parseDay(s);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDay(d);
}

/** "2 – 6 Nov", or "30 Nov – 4 Dec" when a week crosses a month. */
export function rangeLabel(start: string, end: string): string {
  const s = parseDay(start);
  const e = parseDay(end);
  const sm = MONTHS[s.getUTCMonth()];
  const em = MONTHS[e.getUTCMonth()];
  return s.getUTCMonth() === e.getUTCMonth()
    ? `${s.getUTCDate()} – ${e.getUTCDate()} ${sm}`
    : `${s.getUTCDate()} ${sm} – ${e.getUTCDate()} ${em}`;
}

export interface CampWeek {
  index: number;
  start: string; // Monday: what is sent to the API
  end: string; // Friday
  label: string;
}

function buildWeeks(): CampWeek[] {
  const weeks: CampWeek[] = [];
  for (let start = CAMP_FIRST_DAY, i = 1; start <= CAMP_LAST_DAY; start = addDays(start, 7), i++) {
    const end = addDays(start, 4);
    weeks.push({ index: i, start, end, label: rangeLabel(start, end) });
  }
  return weeks;
}

export const CAMP_WEEKS: CampWeek[] = buildWeeks();

/** Today's date at the venue (Nairobi), as YYYY-MM-DD. */
export function todayInNairobi(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** A week stays open until its Friday is over, so late joiners can still enrol. */
export function isWeekOpen(week: CampWeek, today: string): boolean {
  return week.end >= today;
}

// ---- pricing ---------------------------------------------------------------

export interface CampQuote {
  weekCount: number;
  programPerWeek: number;
  lunchPerWeek: number;
  perWeek: number;
  total: number;
}

export function quoteCamp(program: CampProgramId | null, lunch: boolean, weekCount: number): CampQuote {
  const programPerWeek = CAMP_PROGRAMS.find((p) => p.id === program)?.priceKes ?? 0;
  const lunchPerWeek = lunch ? LUNCH_PER_WEEK_KES : 0;
  const perWeek = programPerWeek + lunchPerWeek;
  return { weekCount, programPerWeek, lunchPerWeek, perWeek, total: program ? perWeek * weekCount : 0 };
}

// ---- terms -----------------------------------------------------------------

export const CAMP_TERMS: { title: string; body: string }[] = [
  {
    title: "Taking part is at your own risk",
    body: "Football and the other camp activities involve physical contact and exertion, and injuries can happen. By registering, the parent or guardian accepts that the child takes part entirely at their own risk.",
  },
  {
    title: "Injury and accident waiver",
    body: "K-Arena, St. Sebastian Sports Academy, and their coaches, staff and partners are not responsible or liable if the child is hurt or hurts themselves, whether while playing, training, travelling to or from the camp, or while on the premises, or for any loss of or damage to belongings.",
  },
  {
    title: "Health and medical care",
    body: "The parent or guardian confirms the child is healthy and fit to take part, and will tell the coaches about any medical condition, allergy or injury. If a child needs urgent medical attention, the parent or guardian consents to first aid and emergency treatment being arranged and accepts responsibility for any resulting costs.",
  },
  {
    title: "Drop-off and collection",
    body: "Children must be dropped off and collected on time: by 4:00pm for the full day and 12:30pm for the half day. Please tell the coaches in advance if someone else will collect your child. We cannot supervise children outside camp hours.",
  },
  {
    title: "Behaviour",
    body: "Children are expected to follow the coaches' instructions and play safely and respectfully. Coaches may ask a child to sit out, or to stop attending, if their behaviour puts others at risk.",
  },
  {
    title: "Fees and changes",
    body: "Fees are paid in full by M-Pesa when you register, per child and per week selected, and lunch (Ksh 100 per day) is charged for every selected week when added. Refunds and changes are at the discretion of management.",
  },
  {
    title: "Photos and videos",
    body: "We may take photos and videos at camp to share on K-Arena's channels. If you would rather your child is not included, email us before camp starts.",
  },
  {
    title: "Your details",
    body: "We use the details you give here only to run the camp, take payment and contact you about it.",
  },
];

// ---- form validation (the server repeats every one of these checks) ----------

const NAME_PATTERN = /^[\p{L}\p{M}\p{N} '.&-]+$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[17]\d{8}$/;

export function cleanName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function nameError(raw: string, who: "child" | "parent"): string | undefined {
  const name = cleanName(raw);
  const subject = who === "child" ? "child's" : "parent or guardian's";
  if (!name) return `Enter the ${subject} full name`;
  if (name.length < 2 || name.length > 60) return "Use between 2 and 60 characters";
  if (!NAME_PATTERN.test(name)) return "Use letters, numbers and spaces only";
  return undefined;
}

export function emailError(raw: string): string | undefined {
  const email = raw.trim();
  if (!email) return "Enter an email address";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return "Enter a valid email address";
  return undefined;
}

export function phoneError(digits: string): string | undefined {
  if (!digits) return "Enter the M-Pesa number to charge";
  if (!PHONE_PATTERN.test(digits)) return "Enter 9 digits starting with 7 or 1 (e.g. 712345678)";
  return undefined;
}

/**
 * Keeps the digits typed or pasted into the phone box and drops a leading 254
 * or 0, since the +254 is already shown beside it: pasting "0712 345 678" or
 * "+254712345678" both give 712345678. A Kenyan mobile number never starts
 * with 2, so a leading "254" can only be the country code.
 */
export function normalizePhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 9);
}

/** 712345678 -> "+254 712 345 678" */
export function formatPhone(digits: string): string {
  return `+254 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`.trim();
}

export interface CampRegistrationPayload {
  childName: string;
  parentName: string;
  email: string;
  phoneNumber: string; // 254 + 9 digits
  program: CampProgramId;
  lunch: boolean;
  weeks: string[];
  acceptedTerms: boolean;
  termsVersion: string;
}

/** A row from the admin listing. */
export interface CampRegistrationRecord {
  id: string;
  childName: string;
  parentName: string;
  email: string;
  phoneNumber: string;
  program: CampProgramId;
  programLabel: string;
  lunch: boolean;
  weeks: string[];
  amount: number;
  status: "Paid" | "Pending" | string;
  paidAt: string | null;
  createdAt: string;
  termsVersion: string;
}
