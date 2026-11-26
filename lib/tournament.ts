import { EMAIL } from "@/lib/site";
import { formatKes, nameProblem } from "@/lib/camp";

// The K-Arena tournament (youth U10 and U15, and adults) and registration at the St. Sebastian
// Sports Academy, as the pages and the admin dashboard see them. The booking API
// decides the fees, how many teams a category takes and who gets a place; the
// numbers on the page come from it (GET /tournament), so this file can only ever
// have wording that is out of date, never a price or a limit that is.

/**
 * Identifies the rules text below. It is sent with the registration and the
 * server refuses any other value, so agreement is only ever recorded against the
 * wording that was actually shown. Change it together with the rules and with
 * RulesVersion in the Go API (internal/registration/registration.go).
 */
export const TOURNAMENT_RULES_VERSION = "tournament-2026-v3";

export const TOURNAMENT_NAME = "K-Arena Tournament";

export type TournamentCategoryId = "u10" | "u15" | "adults";

/** The tournament has a youth division (U10 and U15) and an adult one. */
export type TournamentGroup = "youth" | "adults";

/** How many places of one category are taken. */
export interface TournamentSlot {
  id: TournamentCategoryId;
  label: string;
  group: TournamentGroup;
  /** Every team the category takes. */
  capacity: number;
  /** Places among them already taken by the academy's own teams, not sold here. */
  reserved: number;
  /** Teams that have paid. */
  paid: number;
  /** Teams holding a place while their M-Pesa prompt may still be answered. */
  held: number;
  /** Places a new team can still get. */
  left: number;
}

/** What the API says today, used only until it has answered. */
export const DEFAULT_CATEGORIES: TournamentSlot[] = [
  { id: "u10", label: "U10", group: "youth", capacity: 4, reserved: 1, paid: 0, held: 0, left: 3 },
  { id: "u15", label: "U15", group: "youth", capacity: 4, reserved: 1, paid: 0, held: 0, left: 3 },
  { id: "adults", label: "Adults", group: "adults", capacity: 6, reserved: 0, paid: 0, held: 0, left: 6 },
];

/** GET /tournament: the fee, the limits the form applies and the places left. */
export interface TournamentInfo {
  /** What each category a team enters costs, in KSh. */
  feePerCategory: number;
  minPlayers: number;
  maxPlayers: number;
  rulesVersion: string;
  /** How long a team that is paying keeps its place, in minutes. */
  holdMinutes: number;
  categories: TournamentSlot[];
}

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isString = (v: unknown): v is string => typeof v === "string";

function isSlot(v: unknown): v is TournamentSlot {
  const s = v as Partial<TournamentSlot> | null;
  return (
    !!s &&
    typeof s === "object" &&
    (s.id === "u10" || s.id === "u15" || s.id === "adults") &&
    isString(s.label) &&
    (s.group === "youth" || s.group === "adults") &&
    isNumber(s.capacity) &&
    isNumber(s.reserved) &&
    isNumber(s.paid) &&
    isNumber(s.held) &&
    isNumber(s.left)
  );
}

export function isTournamentInfo(v: unknown): v is TournamentInfo {
  const i = v as Partial<TournamentInfo> | null;
  return (
    !!i &&
    typeof i === "object" &&
    isNumber(i.feePerCategory) &&
    isNumber(i.minPlayers) &&
    isNumber(i.maxPlayers) &&
    isString(i.rulesVersion) &&
    isNumber(i.holdMinutes) &&
    Array.isArray(i.categories) &&
    i.categories.every(isSlot)
  );
}

/** What POST /tournament/register takes. */
export interface TournamentPayload {
  academyName: string;
  players: number;
  categories: TournamentCategoryId[];
  phoneNumber: string; // 254 + 9 digits
  acceptedRules: boolean;
  rulesVersion: string;
}

/** What a started registration answers with. */
export interface StartedRegistration {
  reference: string;
  total: number;
}

/** A tournament registration in the admin listing. */
export interface TournamentRegistrationRecord {
  id: string;
  academyName: string;
  players: number;
  categories: TournamentCategoryId[];
  phoneNumber: string;
  amount: number;
  status: "Paid" | "Pending" | string;
  paidAt: string | null;
  createdAt: string;
  /** Categories this paid into after they were full: the payment needs refunding. */
  overflow: string[];
  rulesVersion: string;
}

export interface TournamentAdminData {
  feePerCategory: number;
  holdMinutes: number;
  categories: TournamentSlot[];
  registrations: TournamentRegistrationRecord[];
}

export function isTournamentAdminData(v: unknown): v is TournamentAdminData {
  const d = v as Partial<TournamentAdminData> | null;
  return (
    !!d &&
    typeof d === "object" &&
    isNumber(d.feePerCategory) &&
    isNumber(d.holdMinutes) &&
    Array.isArray(d.categories) &&
    d.categories.every(isSlot) &&
    Array.isArray(d.registrations) &&
    d.registrations.every(
      (r) =>
        !!r &&
        isString(r.id) &&
        isString(r.academyName) &&
        isNumber(r.players) &&
        Array.isArray(r.categories) &&
        isString(r.phoneNumber) &&
        isNumber(r.amount) &&
        isString(r.status) &&
        isString(r.createdAt) &&
        Array.isArray(r.overflow),
    )
  );
}

/** A player's academy registration in the admin listing. */
export interface AcademyRegistrationRecord {
  id: string;
  playerName: string;
  /** YYYY-MM-DD */
  dateOfBirth: string;
  guardianName: string;
  phoneNumber: string;
  amount: number;
  status: "Paid" | "Pending" | string;
  paidAt: string | null;
  createdAt: string;
}

export interface AcademyAdminData {
  fee: number;
  registrations: AcademyRegistrationRecord[];
}

export function isAcademyAdminData(v: unknown): v is AcademyAdminData {
  const d = v as Partial<AcademyAdminData> | null;
  return (
    !!d &&
    typeof d === "object" &&
    isNumber(d.fee) &&
    Array.isArray(d.registrations) &&
    d.registrations.every(
      (r) =>
        !!r &&
        isString(r.id) &&
        isString(r.playerName) &&
        isString(r.dateOfBirth) &&
        isString(r.guardianName) &&
        isString(r.phoneNumber) &&
        isNumber(r.amount) &&
        isString(r.status) &&
        isString(r.createdAt),
    )
  );
}

/** A player's age in whole years on `today` (both YYYY-MM-DD), or null if the date cannot be read. */
export function ageOn(dateOfBirth: string, today: string): number | null {
  const born = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  const now = /^(\d{4})-(\d{2})-(\d{2})$/.exec(today);
  if (!born || !now) return null;
  const [by, bm, bd] = born.slice(1).map(Number);
  const [ny, nm, nd] = now.slice(1).map(Number);
  let age = ny - by;
  if (nm < bm || (nm === bm && nd < bd)) age--;
  return age >= 0 ? age : null;
}

// ---- form validation (the server repeats every one of these checks) ------------

export function academyNameError(raw: string): string | undefined {
  return nameProblem(raw, "name of your academy or club");
}

/** `raw` is what is typed into the box: digits only. */
export function playersError(raw: string, min: number, max: number): string | undefined {
  if (!raw) return "Enter the total number of players";
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) return `Enter a number between ${min} and ${max}`;
  return undefined;
}

// ---- the rules -----------------------------------------------------------------

export interface Rule {
  title: string;
  body: string;
}

/** "U10 takes 4 teams (1 already taken by St. Sebastian Sports Academy), U15 takes 4 …, Adults takes 6" */
function placesSentence(categories: TournamentSlot[]): string {
  return categories
    .map((c) => {
      const taken = c.reserved > 0 ? ` (${c.reserved} already taken by St. Sebastian Sports Academy)` : "";
      return `${c.label} takes ${c.capacity} teams${taken}`;
    })
    .join("; ");
}

/**
 * The tournament rules, written around the numbers the API reports so they can
 * never disagree with what the form enforces. Change the wording together with
 * TOURNAMENT_RULES_VERSION (here and in the Go API).
 */
export function tournamentRules(
  info: Pick<TournamentInfo, "feePerCategory" | "minPlayers" | "maxPlayers" | "holdMinutes" | "categories">,
): Rule[] {
  const categories = info.categories.length > 0 ? info.categories : DEFAULT_CATEGORIES;
  return [
    {
      title: "Categories and ages",
      body: "The tournament has a youth division and an adults division. The youth division has two categories, U10 and U15: a U10 player must be under 10 years old and a U15 player under 15 on the first day of the tournament. The adults category is for players aged 18 and over. The organisers may ask to see proof of age, such as a birth certificate or school ID, and a player who cannot show it may not play.",
    },
    {
      title: "Limited places in each category",
      body: `Places are limited: ${placesSentence(categories)}. Places are given first come, first served. A team that starts registering is held a place while it pays, for up to ${info.holdMinutes} minutes; if the M-Pesa prompt is not paid in that time, the place goes to the next team and your team can register again. A place is yours for good once your payment is confirmed.`,
    },
    {
      title: "One team per academy in each category",
      body: "An academy or club may enter one team in each category. To enter more than one category, tick them all in a single registration: you pay the fee for each category and take one place in each.",
    },
    {
      title: "Registration fee",
      body: `The registration fee is ${formatKes(info.feePerCategory)} for each category you enter: ${formatKes(info.feePerCategory)} for one, ${formatKes(info.feePerCategory * 2)} for two, and so on. It is paid in full by M-Pesa when you register. A confirmation SMS is sent to the number you pay from. Refunds and changes are at the discretion of management, except that if you paid for a place that had already gone to another team (for example, a payment that arrived after your ${info.holdMinutes} minutes were up), we will refund you in full the fee for that place.`,
    },
    {
      title: "Squads",
      body: `Tell us the total number of players in your squad when you register, between ${info.minPlayers} and ${info.maxPlayers}. The organisers may ask for a list of your players' names and ages before your first match. Every player under 18 needs the consent of a parent or guardian to take part.`,
    },
    {
      title: "Fixtures and match rules",
      body: "The dates, fixtures, match length and match format are shared with every registered team, by phone or SMS to the number you registered with, before the tournament begins. Make sure that number is answered by someone who can speak for your team.",
    },
    {
      title: "Fair play and conduct",
      body: "Players, coaches and supporters must respect opponents, match officials and the facility. The referee's decision on the pitch is final. The organisers may send off, or remove from the tournament, any player, coach or supporter, or any team, whose behaviour is unsafe or abusive, and the registration fee is not refunded.",
    },
    {
      title: "Taking part is at your own risk",
      body: "Football involves physical contact and exertion, and injuries can happen. By registering, the academy or club confirms that its players are healthy and fit to play and takes part entirely at its own risk. K-Arena, St. Sebastian Sports Academy, and their coaches, staff and partners are not responsible or liable if a player is hurt, whether while playing, training, travelling to or from the tournament, or on the premises, or for any loss of or damage to belongings. If a player needs urgent medical attention, first aid and emergency treatment may be arranged, and the academy or club is responsible for any resulting costs.",
    },
    {
      title: "Photos and videos",
      body: `We may take photos and videos at the tournament to share on K-Arena's channels. If you would rather your team is not included, email ${EMAIL} before the tournament starts.`,
    },
    {
      title: "Your details",
      body: "We keep the details you give here (your academy's name, the number of players and the phone number you pay from) to run the tournament, take payment and contact you about it. Your phone number goes to Paystack to process the M-Pesa payment, and, with the confirmation message that names your team and the amount paid, to our SMS provider to send it to you. We do not sell your details. Details of registrations that are never paid for are deleted after about a week. See our Privacy Policy for more.",
    },
  ];
}
