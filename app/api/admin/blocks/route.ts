import { NextRequest } from "next/server";
import { proxyAdminGet, proxyAdminWrite } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return proxyAdminGet(req, "/admin/blocks", "Failed to load the blocked sessions");
}

export function POST(req: NextRequest) {
  return proxyAdminWrite(req, "POST", "/admin/blocks", "Failed to block the sessions");
}
