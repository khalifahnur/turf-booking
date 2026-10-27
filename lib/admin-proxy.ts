import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/** The admin's session, or the 401 to answer with. */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = await getToken({ req });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function upstreamConfig(path: string): { base: string; key: string } | NextResponse {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const key = process.env.ADMIN_API_KEY;
  if (!base || !key) {
    console.error(`Admin ${path} unavailable: NEXT_PUBLIC_BASE_URL or ADMIN_API_KEY is not set`);
    return NextResponse.json({ message: "Admin API is not configured" }, { status: 503 });
  }
  return { base, key };
}

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
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const config = upstreamConfig(path);
  if (config instanceof NextResponse) return config;

  try {
    const upstream = await fetch(`${config.base}${path}`, {
      headers: { Authorization: `Bearer ${config.key}` },
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

/** The most an admin action sends; the Go API refuses anything larger anyway. */
const MAX_ADMIN_BODY = 4 * 1024;

/**
 * Like proxyAdminGet, for the admin actions that change something (POST,
 * DELETE). A refusal the Go API wrote for the admin to read (a number that is
 * already on the list, say) is passed on as {message} with its status; anything
 * else becomes `failureMessage`.
 *
 * Another site cannot make these requests with the admin's session: the session
 * cookie is SameSite=Lax, so it is never sent with a cross-site POST or DELETE;
 * a POST must be JSON, which a page on another site cannot send without a CORS
 * preflight that this app never answers; and so is every DELETE.
 */
export async function proxyAdminWrite(
  req: NextRequest,
  method: "POST" | "DELETE",
  path: string,
  failureMessage: string,
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let body: string | undefined;
  if (method === "POST") {
    if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return NextResponse.json({ message: "Content-Type must be application/json" }, { status: 415 });
    }
    // Refuse an oversized body before reading it, when it says how big it is.
    if (Number(req.headers.get("content-length") ?? 0) > MAX_ADMIN_BODY) {
      return NextResponse.json({ message: "Request too large" }, { status: 413 });
    }
    const text = await req.text();
    if (text.length > MAX_ADMIN_BODY) {
      return NextResponse.json({ message: "Request too large" }, { status: 413 });
    }
    try {
      body = JSON.stringify(JSON.parse(text));
    } catch {
      return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
    }
  }

  const config = upstreamConfig(path);
  if (config instanceof NextResponse) return config;

  try {
    const upstream = await fetch(`${config.base}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${config.key}`,
        ...(body !== undefined && { "Content-Type": "application/json" }),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    const noStore = { "Cache-Control": "no-store" };
    if (upstream.status === 204) return new NextResponse(null, { status: 204, headers: noStore });
    if (upstream.ok) {
      return NextResponse.json(await upstream.json(), { status: upstream.status, headers: noStore });
    }
    // Only wording the API marked as meant to be read is passed on: an error page
    // from a proxy in front of it is not.
    if (upstream.headers.get("x-user-message") === "1") {
      const text = (await upstream.text()).trim();
      if (text && text.length <= 300 && !text.startsWith("<")) {
        return NextResponse.json({ message: text }, { status: upstream.status, headers: noStore });
      }
    }
    console.error(`Admin ${method} ${path} upstream returned ${upstream.status}`);
    return NextResponse.json({ message: failureMessage }, { status: 502 });
  } catch (err) {
    console.error(`Admin ${method} ${path} upstream error:`, err);
    return NextResponse.json({ message: failureMessage }, { status: 502 });
  }
}
