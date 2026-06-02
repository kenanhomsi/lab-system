import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { getBackendBaseUrl } from "@/lib/api/bff-proxy";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";

export async function DELETE(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    if (!isUpstreamBackendReady()) {
      return NextResponse.json({ ok: true });
    }
    const res = await fetch(`${getBackendBaseUrl()}/api/store/cart/coupon`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await res.json().catch(() => ({}));
    return NextResponse.json(payload, { status: res.status });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
