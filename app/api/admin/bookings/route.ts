import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

/**
 * The only way the dashboard reads customer details. The browser calls this
 * same-origin route; this route checks the admin session, then calls the Go API
 * with a key that exists only in this server's environment (ADMIN_API_KEY,
 * deliberately not NEXT_PUBLIC_). Calling the Go API straight from the browser
 * would mean shipping that key to every visitor.
 */
export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const key = process.env.ADMIN_API_KEY;
  if (!base || !key) {
    console.error("Admin bookings unavailable: NEXT_PUBLIC_BASE_URL or ADMIN_API_KEY is not set");
    return NextResponse.json({ message: "Admin API is not configured" }, { status: 503 });
  }

  try {
    const upstream = await fetch(`${base}/admin/bookings`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!upstream.ok) {
      console.error(`Admin bookings upstream returned ${upstream.status}`);
      return NextResponse.json({ message: "Failed to load bookings" }, { status: 502 });
    }
    return NextResponse.json(await upstream.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Admin bookings upstream error:", err);
    return NextResponse.json({ message: "Failed to load bookings" }, { status: 502 });
  }
}
