import { parseRange } from "./schedule";
import type { BookingRecord, PitchType, TimeSlot } from "./types";

export { parseRange };

/** The pitch holds two half-pitch units: 5-a-side uses one, 8-a-side uses both. */
const CAPACITY = 2;
const UNITS: Record<PitchType, number> = { "5Aside": 1, "8Aside": 2 };

// "Booked" is a paid booking, "Confirmed" only appears in older rows.
const HOLDING = new Set(["Pending", "Booked", "Confirmed"]);

interface Occupancy {
  start: number;
  end: number;
  units: number;
  pending: boolean;
}

/**
 * Can `units` of pitch be added for the whole of [start, end)? Sessions of
 * different lengths overlap each other, so this looks at the busiest moment in
 * the window instead of comparing time labels. Mirrors the server's check.
 */
function fits(existing: Occupancy[], start: number, end: number, units: number): boolean {
  const moments = [start, ...existing.filter((o) => o.start > start && o.start < end).map((o) => o.start)];
  return moments.every((t) => {
    const load = existing.reduce((sum, o) => (o.start <= t && t < o.end ? sum + o.units : sum), units);
    return load <= CAPACITY;
  });
}

export type PitchState = "Available" | "Pending" | "Booked";

export interface SlotAvailability {
  "5Aside": PitchState;
  "8Aside": PitchState;
  /** Half-pitches still free for the whole session (0, 1 or 2). */
  halvesLeft: number;
}

export function slotAvailability(
  slot: TimeSlot,
  date: string,
  records: BookingRecord[],
): SlotAvailability {
  // Minutes on the operating day's own clock: a session into the early hours
  // has an end past 1440, so it overlaps the sessions around midnight correctly.
  const start = slot.from;
  const end = slot.to;
  const bounds: [number, number] = [start, end];

  const existing: Occupancy[] = [];
  for (const r of records) {
    if (r.date !== date || !HOLDING.has(r.status)) continue;
    // A row we cannot read blocks this slot rather than freeing it.
    const [from, to] = parseRange(r.time) ?? bounds;
    const units = UNITS[r.pitchType as PitchType] ?? CAPACITY;
    existing.push({ start: from, end: to, units, pending: r.status === "Pending" });
  }

  const stateFor = (pitch: PitchType): PitchState => {
    const units = UNITS[pitch];
    if (fits(existing, start, end, units)) return "Available";
    // Taken now, but it would be free again if every unpaid hold lapsed.
    const paidOnly = existing.filter((o) => !o.pending);
    return fits(paidOnly, start, end, units) ? "Pending" : "Booked";
  };

  let halvesLeft = 0;
  for (const units of [1, 2]) {
    if (fits(existing, start, end, units)) halvesLeft = units;
  }

  return { "5Aside": stateFor("5Aside"), "8Aside": stateFor("8Aside"), halvesLeft };
}
