import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { placeStoreOrderSchema, storeModuleNames, StoreBackendService } from "@/modules/store";

const storeService = backendContainer.get<StoreBackendService>(storeModuleNames.service);

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const body = placeStoreOrderSchema.parse(await req.json());
    const res = await storeService.placeOrder({ token, ...body });
    return NextResponse.json(res, { status: 200 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
