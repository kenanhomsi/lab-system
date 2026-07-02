import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { bannerModuleNames } from "@/modules/banner";
import { BannerBackendService } from "@/modules/banner/backend";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { DISPLAY_MODE_VALUES } from "@/lib/banners/display-mode";
import { isBannerSlotLocation, isValidBannerSlot } from "@/lib/banners/slots";
import { isPathTarget, pageTargetSchema } from "@/lib/banners/page-target";

const bannerService = backendContainer.get<BannerBackendService>(
  bannerModuleNames.service,
);

type RouteContext = { params: Promise<{ id: string }> };

const displayModeSchema = z.enum(DISPLAY_MODE_VALUES);

const updateBannerSchema = z
  .object({
    title: z.string().trim().min(1),
    type: z.string().trim().min(1),
    DisplayMode: displayModeSchema,
    InternalLink: z.string().trim(),
    ExternalLink: z.string().trim(),
    TargetType: z.string().trim().min(1),
    Location: pageTargetSchema,
    DisplayOrder: z.number().int().positive(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
    isActive: z.boolean(),
    VisibilityRulesJson: z.string(),
    Media: z.instanceof(File).optional(),
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
      !isPathTarget(value.Location) &&
      isBannerSlotLocation(value.Location) &&
      !isValidBannerSlot(value.Location, value.DisplayOrder)
    ) {
      context.addIssue({
        code: "custom",
        message: "DisplayOrder is not a valid slot for the selected Location",
      });
    }
    if (
      value.Media &&
      (!value.Media.type.match(/^(image|video)\//) ||
        value.Media.size > 50 * 1024 * 1024)
    ) {
      context.addIssue({
        code: "custom",
        message: "Media must be an image or video no larger than 50MB",
      });
    }
  });

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id } = await context.params;
    if (!id) {
      throw new Error("Missing banner ID");
    }

    const contentType = req.headers.get("content-type");
    let body: FormData | Record<string, unknown>;

    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      updateBannerSchema.parse({
        title: String(formData.get("Title") ?? formData.get("title") ?? ""),
        type: String(formData.get("Type") ?? formData.get("type") ?? ""),
        DisplayMode: String(
          formData.get("DisplayMode") ?? formData.get("displayMode") ?? "",
        ),
        InternalLink: String(
          formData.get("InternalLink") ?? formData.get("internalLink") ?? "",
        ),
        ExternalLink: String(
          formData.get("ExternalLink") ?? formData.get("externalLink") ?? "",
        ),
        TargetType: String(
          formData.get("TargetType") ?? formData.get("targetType") ?? "",
        ),
        Location: String(formData.get("Location") ?? formData.get("location") ?? ""),
        DisplayOrder: Number(
          formData.get("DisplayOrder") ?? formData.get("displayOrder") ?? 0,
        ),
        startDate: String(
          formData.get("StartDate") ?? formData.get("startDate") ?? "",
        ),
        endDate: String(formData.get("EndDate") ?? formData.get("endDate") ?? ""),
        isActive:
          String(formData.get("IsActive") ?? formData.get("isActive") ?? "false") ===
          "true",
        VisibilityRulesJson: String(
          formData.get("VisibilityRulesJson") ?? formData.get("visibilityRulesJson") ?? "",
        ),
        Media: (() => {
          const media = formData.get("Media") ?? formData.get("media");
          return media instanceof File ? media : undefined;
        })(),
      });
      body = formData;
    } else {
      const json = (await req.json()) as Record<string, unknown>;
      updateBannerSchema.parse({
        title: String(json.title ?? json.Title ?? ""),
        type: String(json.type ?? json.Type ?? ""),
        DisplayMode: String(json.displayMode ?? json.DisplayMode ?? ""),
        InternalLink: String(json.internalLink ?? json.InternalLink ?? ""),
        ExternalLink: String(json.externalLink ?? json.ExternalLink ?? ""),
        TargetType: String(json.targetType ?? json.TargetType ?? ""),
        Location: String(json.location ?? json.Location ?? ""),
        DisplayOrder: Number(json.displayOrder ?? json.DisplayOrder ?? 0),
        startDate: String(json.startDate ?? json.StartDate ?? ""),
        endDate: String(json.endDate ?? json.EndDate ?? ""),
        isActive: Boolean(json.isActive ?? json.IsActive ?? false),
        VisibilityRulesJson: String(
          json.visibilityRulesJson ?? json.VisibilityRulesJson ?? "",
        ),
        Media:
          json.media instanceof File
            ? json.media
            : json.Media instanceof File
              ? json.Media
              : undefined,
      });
      body = json;
    }

    const res = await bannerService.update({ token, id, body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id } = await context.params;
    if (!id) {
      throw new Error("Missing banner ID");
    }

    await bannerService.delete({ token, id });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
