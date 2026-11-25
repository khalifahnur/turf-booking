import { NextRequest } from "next/server";
import { proxyAdminGet } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return proxyAdminGet(req, "/admin/tournament/registrations", "Failed to load the tournament registrations");
}
