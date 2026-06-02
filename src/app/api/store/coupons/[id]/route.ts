import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  storeModuleNames,
  StoreBackendService,
  upsertStoreCouponSchema,
} from "@/modules/store";

const storeService = backendContainer.get<StoreBackendService>(storeModuleNames.service);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const couponId = Number(id);
    if (!Number.isFinite(couponId)) throw new Error("Invalid coupon id");
    const body = upsertStoreCouponSchema.parse(await req.json());
    const res = await storeService.updateCoupon({ token, id: couponId, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
