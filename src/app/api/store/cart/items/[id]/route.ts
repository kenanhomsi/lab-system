import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { getBackendBaseUrl } from "@/lib/api/bff-proxy";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import { updateStoreCartItemSchema } from "@/modules/store";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const itemId = Number(id);
    if (!Number.isFinite(itemId)) throw new Error("Invalid cart item id");
    const body = updateStoreCartItemSchema.parse(await req.json());
    if (!isUpstreamBackendReady()) {
      return NextResponse.json({ ok: true });
    }
    const res = await fetch(`${getBackendBaseUrl()}/api/store/cart/items/${itemId}`, {
      method: "PUT",
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const itemId = Number(id);
    if (!Number.isFinite(itemId)) throw new Error("Invalid cart item id");
    if (!isUpstreamBackendReady()) {
      return new NextResponse(null, { status: 204 });
    }
    const res = await fetch(`${getBackendBaseUrl()}/api/store/cart/items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return new NextResponse(null, { status: res.status === 200 ? 204 : res.status });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
