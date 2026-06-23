import { NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { adModuleNames } from "@/modules/ad";
import { AdBackendService } from "@/modules/ad/backend";

const adService = backendContainer.get<AdBackendService>(adModuleNames.service);

export async function GET() {
  try {
    const res = await adService.findAllPublic();
    return NextResponse.json(res, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
