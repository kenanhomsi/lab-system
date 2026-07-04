import { NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { adModuleNames } from "@/modules/ad";
import { AdBackendService } from "@/modules/ad/backend";

const adService = backendContainer.get<AdBackendService>(adModuleNames.service);
const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
};

export async function GET() {
  try {
    const res = await adService.findAllPublic();
    return NextResponse.json(res, { headers: PUBLIC_CACHE_HEADERS });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
