import { NextRequest, NextResponse } from "next/server";
import { proxyAdminWrite, requireAdmin } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ series: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  // A series id is 32 hex digits. Nothing else is put in the path of the request
  // to the API.
  const { series } = await params;
  if (!/^[0-9a-f]{32}$/.test(series)) {
    return NextResponse.json({ message: "That is not a series of blocked sessions." }, { status: 400 });
  }
  return proxyAdminWrite(req, "DELETE", `/admin/block-series/${series}`, "Failed to unblock the sessions");
}
