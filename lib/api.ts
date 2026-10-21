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

// The Go API answers errors with plain text (or JSON with a `message`); either
// way the text is written for the person filling in the form.
async function errorMessage(res: Response, fallback: string): Promise<string> {
  const text = await res.text();
  try {
    return JSON.parse(text).message || text;
  } catch {
    return text.trim() || fallback;
  }
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

/** Starts a camp registration: validates it, prices it and sends the M-Pesa prompt. */
export const registerCamp = async (
  payload: CampRegistrationPayload,
): Promise<{ reference: string; total: number }> => {
  const res = await fetch(`${BASE_URL}/camp/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, "We couldn't start your registration. Please try again."));
  }
  return res.json();
};

// Like the bookings list, this goes through our own route, which checks the
// admin session and holds the API key.
export const fetchCampRegistrationsAdmin = async (): Promise<CampRegistrationRecord[]> => {
  const res = await fetch("/api/admin/camp-registrations", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch camp registrations");
  return res.json();
};
