import { createHash, timingSafeEqual } from "crypto";

/**
 * Constant-time password check. Hashing first gives both sides the same length,
 * so neither the length nor the content of the real password leaks via timing.
 * An unset ADMIN_PASSWORD (or an empty attempt) never matches: comparing
 * `undefined === undefined` used to log anyone in on a misconfigured deploy.
 */
export function verifyAdminPassword(supplied: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof supplied !== "string" || supplied.length === 0) return false;
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 8;
const failures = new Map<string, { count: number; first: number }>();

/**
 * Best-effort brute-force brake on the admin login, per client IP. State is
 * per server instance, so on serverless it slows guessing rather than stopping
 * it; a long ADMIN_PASSWORD is what actually protects the dashboard.
 */
export function loginThrottled(ip: string): boolean {
  const now = Date.now();
  const entry = failures.get(ip);
  if (!entry) return false;
  if (now - entry.first > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordLoginFailure(ip: string) {
  const now = Date.now();
  if (failures.size > 5_000) failures.clear(); // bound memory
  const entry = failures.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    failures.set(ip, { count: 1, first: now });
  } else {
    entry.count += 1;
  }
}

export function clearLoginFailures(ip: string) {
  failures.delete(ip);
}
