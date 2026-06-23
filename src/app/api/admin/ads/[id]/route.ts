import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { adModuleNames } from "@/modules/ad";
import { AdBackendService } from "@/modules/ad/backend";

const adService = backendContainer.get<AdBackendService>(adModuleNames.service);

type RouteContext = { params: Promise<{ id: string }> };

const mediaTypeSchema = z.enum(["Image", "Video"]);

const updateAdSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    mediaType: mediaTypeSchema,
    media: z.instanceof(File).optional(),
    addressName: z.string().trim().min(1),
  })
  .superRefine((value, context) => {
    if (!value.media) return;
    const expectedPrefix = value.mediaType === "Image" ? "image/" : "video/";
    if (!value.media.type.startsWith(expectedPrefix)) {
      context.addIssue({
        code: "custom",
        message: `Media must be a ${value.mediaType.toLowerCase()} file`,
      });
    }
    if (value.media.size > 50 * 1024 * 1024) {
      context.addIssue({
        code: "custom",
        message: "Media must be no larger than 50MB",
      });
    }
  });

const parseId = async (context: RouteContext) => {
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("Invalid ad ID");
  }
  return numericId;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const id = await parseId(context);
    const res = await adService.findOne({ token, id });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const id = await parseId(context);
    const body = await req.formData();
    const media = body.get("Media");
    const input = updateAdSchema.parse({
      id,
      name: String(body.get("Name") ?? ""),
      description: String(body.get("Description") ?? ""),
      mediaType: String(body.get("MediaType") ?? ""),
      addressName: String(body.get("AddressName") ?? ""),
      media: media instanceof File ? media : undefined,
    });
    const res = await adService.update({ token, ...input });
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
    const id = await parseId(context);
    await adService.delete({ token, id });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
