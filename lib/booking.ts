import { PitchOption, PitchType, SessionLength, TimeSlot } from "./types";

export const BRAND = {
  colors: {
    navyBlue:       "#121e34",
    darkTeal:       "#1f4b50",  
    limeGreen:      "#88b03f",  
    white:          "#ffffff",  
    red:            "#E10600",  
    royalBlue:      "#233e95",  
    electricYellow: "#fed107", 
    vibrantGreen:   "#00a64f",  
    surface1: "#162030", 
    surface2: "#1a2a3a",  
  },
  font: "'Averta', 'Nunito', 'Inter', system-ui, sans-serif",
} as const;

/**
 * Opening hours (24h clock). The booking API enforces the same hours and the
 * same session grid, so a slot the UI offers is always one the server accepts.
 */
export const OPENING_HOURS = {
  weekday: { open: 16, close: 22 },
  weekend: { open: 8, close: 22 },
} as const;

export const SESSION_LENGTHS: { minutes: SessionLength; short: string; long: string }[] = [
  { minutes: 60, short: "1 hr", long: "1 hr Session" },
  { minutes: 120, short: "2 hr", long: "2 hr Session" },
];

export const DEFAULT_SESSION_LENGTH: SessionLength = 120;

/**
 * What the UI shows. The amount actually charged is decided by the server from
 * the pitch type and the session length, never from anything sent by the
 * browser, so this table can only ever be out of date, not be exploited.
 */
export const PRICES_KES: Record<PitchType, Record<SessionLength, number>> = {
  "5Aside": { 60: 3_000, 120: 6_000 },
  "8Aside": { 60: 5_000, 120: 10_000 },
};

export const priceFor = (pitch: PitchType, minutes: SessionLength): number =>
  PRICES_KES[pitch][minutes];

const clock = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

function buildSlots(open: number, close: number, minutes: SessionLength): TimeSlot[] {
  const hours = minutes / 60;
  const slots: TimeSlot[] = [];
  for (let h = open; h + hours <= close; h += hours) {
    slots.push({
      timeRange: `${clock(h)} – ${clock(h + hours)}`,
      startTime: clock(h),
      minutes,
    });
  }
  return slots;
}

const SLOTS = {
  weekday: {
    60: buildSlots(OPENING_HOURS.weekday.open, OPENING_HOURS.weekday.close, 60),
    120: buildSlots(OPENING_HOURS.weekday.open, OPENING_HOURS.weekday.close, 120),
  },
  weekend: {
    60: buildSlots(OPENING_HOURS.weekend.open, OPENING_HOURS.weekend.close, 60),
    120: buildSlots(OPENING_HOURS.weekend.open, OPENING_HOURS.weekend.close, 120),
  },
} as const;

export const getSlots = (isWeekend: boolean, minutes: SessionLength): TimeSlot[] =>
  SLOTS[isWeekend ? "weekend" : "weekday"][minutes];

export const PITCH_OPTIONS: PitchOption[] = [
  {
    type:       "5Aside",
    label:      "5-Aside",
    maxPlayers: 10,
    pitchSize:  "Half Pitch",
  },
  {
    type:       "8Aside",
    label:      "8-Aside",
    maxPlayers: 16,
    pitchSize:  "Full Field",
  },
];


export const KSH = (amount: number): string =>
  `Ksh. ${amount.toLocaleString("en-KE")}`;

export const slotKey = (
  date: string,
  timeRange: string,
  pitchType: string
): string => `${date}|${timeRange}|${pitchType}`;



