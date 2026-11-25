import { NextRequest } from "next/server";
import { proxyAdminGet } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return proxyAdminGet(req, "/admin/academy/registrations", "Failed to load the academy registrations");
}
