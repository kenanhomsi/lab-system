import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { getBackendBaseUrl } from "@/lib/api/bff-proxy";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import { applyStoreCouponSchema } from "@/modules/store";

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const body = applyStoreCouponSchema.parse(await req.json());
    if (!isUpstreamBackendReady()) {
      return NextResponse.json({ ok: true });
    }
    const res = await fetch(`${getBackendBaseUrl()}/api/store/cart/apply-coupon`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    return NextResponse.json(payload, { status: res.status });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
