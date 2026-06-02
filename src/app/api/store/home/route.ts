import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { storeModuleNames, StoreBackendService } from "@/modules/store";

const storeService = backendContainer.get<StoreBackendService>(storeModuleNames.service);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const res = await storeService.getHome({ token });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
