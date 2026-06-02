import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  storeModuleNames,
  StoreBackendService,
  upsertStoreSliderSchema,
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
    const sliderId = Number(id);
    if (!Number.isFinite(sliderId)) throw new Error("Invalid slider id");
    const body = upsertStoreSliderSchema.parse(await req.json());
    const res = await storeService.updateSlider({ token, id: sliderId, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
