import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { getBackendBaseUrl, isUpstreamBackendReady } from "@/lib/api/upstream-config";
import { updateStoreCartSchema } from "@/modules/store";

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    if (!isUpstreamBackendReady()) {
      return NextResponse.json({
        id: 0,
        items: [],
        couponCode: "",
        subtotal: 0,
        discountAmount: 0,
        deliveryFee: 0,
        total: 0,
        deliveryDurationText: "",
      });
    }
    const res = await fetch(`${getBackendBaseUrl()}/api/store/cart`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const body = updateStoreCartSchema.parse(await req.json());
    if (!isUpstreamBackendReady()) {
      return NextResponse.json({
        id: 0,
        items: [],
        couponCode: "",
        subtotal: 0,
        discountAmount: 0,
        deliveryFee: 0,
        total: 0,
        deliveryDurationText: "",
      });
    }
    const res = await fetch(`${getBackendBaseUrl()}/api/store/cart/items`, {
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
