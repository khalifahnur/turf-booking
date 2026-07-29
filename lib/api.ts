const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings`);
  if (!res.ok) throw new Error("Failed to fetch slots");
  return res.json();
};

export const fetchBookingsAdmin = async () => {
  const res = await fetch(`${BASE_URL}/admin/bookings`);
  if (!res.ok) throw new Error("Failed to fetch slots");
  return res.json();
};

export const initiateBooking = async (bookingData: any) => {
  const res = await fetch(`${BASE_URL}/initiate/paystack/push-stk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Payment initiation failed");
  }
  
  return res.json();
};