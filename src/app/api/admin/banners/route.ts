import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { bannerModuleNames } from "@/modules/banner";
import { BannerBackendService } from "@/modules/banner/backend";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { z } from "zod";
import { isBannerSlotLocation, isValidBannerSlot } from "@/lib/banners/slots";

const bannerService = backendContainer.get<BannerBackendService>(
  bannerModuleNames.service,
);

const createBannerSchema = z
  .object({
    title: z.string().trim().min(1),
    type: z.string().trim().min(1),
    InternalLink: z.string().trim(),
    ExternalLink: z.string().trim(),
    TargetType: z.string().trim().min(1),
    Location: z.string().trim().min(1),
    DisplayOrder: z.number().int().positive(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
    isActive: z.boolean(),
    VisibilityRulesJson: z.string(),
    Media: z.instanceof(File),
  })
  .superRefine((value, context) => {
    if (value.InternalLink && value.ExternalLink) {
      context.addIssue({
        code: "custom",
        message: "Only one of InternalLink or ExternalLink may be provided",
      });
    }
    if (new Date(value.endDate) <= new Date(value.startDate)) {
      context.addIssue({
        code: "custom",
        message: "EndDate must be later than StartDate",
      });
    }
    if (
      isBannerSlotLocation(value.Location) &&
      !isValidBannerSlot(value.Location, value.DisplayOrder)
    ) {
      context.addIssue({
        code: "custom",
        message: "DisplayOrder is not a valid slot for the selected Location",
      });
    }
    if (
      !value.Media.type.match(/^(image|video)\//) ||
      value.Media.size > 50 * 1024 * 1024
    ) {
      context.addIssue({
        code: "custom",
        message: "Media must be an image or video no larger than 50MB",
      });
    }
  });

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

    const input = createBannerSchema.parse({
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
    const res = await bannerService.create({ token, ...input });
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
