import { NextRequest, NextResponse } from "next/server";
import { proxyAdminWrite, requireAdmin } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  // The dashboard sends the number as 254712345678. Nothing but digits is put in
  // the path of the request to the API.
  const { phone } = await params;
  if (!/^\d{9,12}$/.test(phone)) {
    return NextResponse.json({ message: "Enter a valid Kenyan mobile number" }, { status: 400 });
  }
  return proxyAdminWrite(req, "DELETE", `/admin/members/${phone}`, "Failed to remove the member");
}
