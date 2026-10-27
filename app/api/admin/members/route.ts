import { NextRequest } from "next/server";
import { proxyAdminGet, proxyAdminWrite } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return proxyAdminGet(req, "/admin/members", "Failed to load the members");
}

export function POST(req: NextRequest) {
  return proxyAdminWrite(req, "POST", "/admin/members", "Failed to add the member");
}
