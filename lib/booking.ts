import { PitchOption, PitchType, SessionLength } from "./types";

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
 * The venue's opening hours as written on the website and in its search-engine
 * data (24h clock; "01:00" is one in the morning of the next day). Weekends and
 * Kenyan public holidays share the weekend hours. The booking calendar itself is
 * never drawn from this: it shows the sessions the API sends (lib/schedule.ts),
 * so what it offers is always what the server accepts.
 */
export const OPENING_HOURS = {
  weekday: [
    { open: "07:00", close: "09:00" },
    { open: "15:00", close: "01:00" },
  ],
  weekend: [{ open: "07:00", close: "01:00" }],
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



