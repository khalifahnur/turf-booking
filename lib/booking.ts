import { PitchOption, TimeSlot } from "./types";

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

export const WEEKDAY_SLOTS: TimeSlot[] = [
  { timeRange: "16:00 – 18:00", startTime: "16:00" },
  { timeRange: "18:00 – 20:00", startTime: "18:00" },
  { timeRange: "20:00 – 22:00", startTime: "20:00" },
];

export const WEEKEND_SLOTS: TimeSlot[] = [
  { timeRange: "08:00 – 10:00", startTime: "08:00" },
  { timeRange: "10:00 – 12:00", startTime: "10:00" },
  { timeRange: "12:00 – 14:00", startTime: "12:00" },
  { timeRange: "14:00 – 16:00", startTime: "14:00" },
  { timeRange: "16:00 – 18:00", startTime: "16:00" },
  { timeRange: "18:00 – 20:00", startTime: "18:00" },
  { timeRange: "20:00 – 22:00", startTime: "20:00" },
];

export const PITCH_OPTIONS: PitchOption[] = [
  {
    type:       "5Aside",
    label:      "5-Aside",
    price:      6_500,
    maxPlayers: 10,
    pitchSize:  "Half Pitch",
  },
  {
    type:       "8Aside",
    label:      "8-Aside",
    price:      12_000,
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



