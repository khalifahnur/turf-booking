import type { CampRegistrationPayload, CampRegistrationRecord } from "@/lib/camp";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings`);
  if (!res.ok) throw new Error("Failed to fetch slots");
  return res.json();
};

// Goes through our own Next.js route, which checks the admin session and holds
// the API key. The Go API refuses this request from a browser.
export const fetchBookingsAdmin = async () => {
  const res = await fetch("/api/admin/bookings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch slots");
  return res.json();
};

// The Go API answers a refusal with a short plain-text sentence written for the
// person filling in the form. Responses it marks with X-User-Message (any
// status, including the 5xx it writes itself) are shown as they are. Without
// the marker only the usual 4xx refusals are trusted; a 502 page from a proxy or
// a bare 500 is not, so it is replaced by `fallback` instead of reaching a
// parent as raw markup or a technical message.
const READABLE_STATUSES = new Set([400, 409, 413, 415, 422, 429]);
const MAX_MESSAGE_LENGTH = 400;

async function errorMessage(res: Response, fallback: string): Promise<string> {
  const marked = res.headers.get("X-User-Message") === "1";
  if (!marked && !READABLE_STATUSES.has(res.status)) return fallback;
  const text = (await res.text()).trim();
  let message = text;
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed?.message === "string") message = parsed.message.trim();
  } catch {
    // plain text, which is what the API normally sends
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH || message.startsWith("<")) return fallback;
  return message;
}

export const initiateBooking = async (bookingData: any) => {
  const res = await fetch(`${BASE_URL}/initiate/paystack/push-stk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  
  if (!res.ok) {
    throw new Error(await errorMessage(res, "Payment initiation failed"));
  }
  
  return res.json();
};

/** A failed camp registration; `message` is safe to show to a parent as it is. */
export class CampApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
    this.name = "CampApiError";
  }
}

const CAMP_UNREACHABLE =
  "We couldn't reach the registration service. Please check your connection and try again. If an M-Pesa prompt arrives, you can still enter your PIN and we'll confirm by SMS.";
export const CAMP_FAILED =
  "We couldn't start your registration just now. Please try again in a moment. If an M-Pesa prompt arrives, you can still enter your PIN and we'll confirm by SMS.";

/** Starts a camp registration: validates it, prices it and sends the M-Pesa prompt. */
export const registerCamp = async (
  payload: CampRegistrationPayload,
): Promise<{ reference: string; total: number }> => {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/camp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new CampApiError(CAMP_UNREACHABLE, null);
  }
  if (!res.ok) {
    throw new CampApiError(await errorMessage(res, CAMP_FAILED), res.status);
  }
  try {
    return await res.json();
  } catch {
    // The prompt may well have been sent; do not show a parsing error.
    throw new CampApiError(CAMP_FAILED, res.status);
  }
};

// Like the bookings list, this goes through our own route, which checks the
// admin session and holds the API key.
export const fetchCampRegistrationsAdmin = async (): Promise<CampRegistrationRecord[]> => {
  const res = await fetch("/api/admin/camp-registrations", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch camp registrations");
  return res.json();
};
