import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Lets the admin dashboard read a protected Go API endpoint.
 *
 * The browser calls one of our own same-origin routes; that route checks the
 * admin session (and role), then calls the Go API with a key that exists only
 * in this server's environment (ADMIN_API_KEY, deliberately not NEXT_PUBLIC_).
 * Calling the Go API straight from the browser would mean shipping that key to
 * every visitor.
 *
 * `path` is relative to NEXT_PUBLIC_BASE_URL, e.g. "/admin/bookings".
 */
export async function proxyAdminGet(req: NextRequest, path: string, failureMessage: string) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const key = process.env.ADMIN_API_KEY;
  if (!base || !key) {
    console.error(`Admin ${path} unavailable: NEXT_PUBLIC_BASE_URL or ADMIN_API_KEY is not set`);
    return NextResponse.json({ message: "Admin API is not configured" }, { status: 503 });
  }

  try {
    const upstream = await fetch(`${base}${path}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!upstream.ok) {
      console.error(`Admin ${path} upstream returned ${upstream.status}`);
      return NextResponse.json({ message: failureMessage }, { status: 502 });
    }
    return NextResponse.json(await upstream.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(`Admin ${path} upstream error:`, err);
    return NextResponse.json({ message: failureMessage }, { status: 502 });
  }
}
