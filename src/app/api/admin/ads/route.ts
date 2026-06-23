import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { adModuleNames } from "@/modules/ad";
import { AdBackendService } from "@/modules/ad/backend";

const adService = backendContainer.get<AdBackendService>(adModuleNames.service);

const mediaTypeSchema = z.enum(["Image", "Video"]);

const createAdSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    mediaType: mediaTypeSchema,
    media: z.instanceof(File),
    addressName: z.string().trim().min(1),
  })
  .superRefine((value, context) => {
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

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await adService.findAll({ token, query });
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

    const input = createAdSchema.parse({
      name: String(body.get("Name") ?? ""),
      description: String(body.get("Description") ?? ""),
      mediaType: String(body.get("MediaType") ?? ""),
      addressName: String(body.get("AddressName") ?? ""),
      media,
    });
    const res = await adService.create({ token, ...input });
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
