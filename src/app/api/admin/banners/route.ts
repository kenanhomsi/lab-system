import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { bannerModuleNames } from "@/modules/banner";
import { BannerBackendService } from "@/modules/banner/backend";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const bannerService = backendContainer.get<BannerBackendService>(
  bannerModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await bannerService.findAll({ token, query });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const body = await req.formData();
    const media = body.get("Media");
    if (!(media instanceof File)) {
      throw new Error("Missing Media file");
    }

    const res = await bannerService.create({
      token,
      title: String(body.get("title") ?? ""),
      type: String(body.get("type") ?? ""),
      InternalLink: String(body.get("InternalLink") ?? ""),
      ExternalLink: String(body.get("ExternalLink") ?? ""),
      TargetType: String(body.get("TargetType") ?? ""),
      Location: String(body.get("Location") ?? ""),
      DisplayOrder: Number(body.get("DisplayOrder") ?? 0),
      startDate: String(body.get("startDate") ?? ""),
      endDate: String(body.get("endDate") ?? ""),
      isActive: String(body.get("isActive") ?? "false") === "true",
      VisibilityRulesJson: String(body.get("VisibilityRulesJson") ?? ""),
      Media: media,
    });
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
