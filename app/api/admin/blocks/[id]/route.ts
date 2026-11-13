import { NextRequest, NextResponse } from "next/server";
import { proxyAdminWrite, requireAdmin } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  // A block's id is 24 hex digits. Nothing else is put in the path of the request
  // to the API.
  const { id } = await params;
  if (!/^[0-9a-f]{24}$/.test(id)) {
    return NextResponse.json({ message: "That is not a blocked session." }, { status: 400 });
  }
  return proxyAdminWrite(req, "DELETE", `/admin/blocks/${id}`, "Failed to unblock the session");
}
