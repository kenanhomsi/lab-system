import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { bannerModuleNames } from "@/modules/banner";
import { BannerBackendService } from "@/modules/banner/backend";

const bannerService = backendContainer.get<BannerBackendService>(
  bannerModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const location = req.nextUrl.searchParams.get("location") ?? undefined;
    const res = await bannerService.findAllPublic({ location });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
