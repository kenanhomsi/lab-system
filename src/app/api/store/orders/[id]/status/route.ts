import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  storeModuleNames,
  StoreBackendService,
  updateStoreOrderStatusSchema,
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
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) throw new Error("Invalid order id");
    const body = updateStoreOrderStatusSchema.parse(await req.json());
    const res = await storeService.updateOrderStatus({ token, id: orderId, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
