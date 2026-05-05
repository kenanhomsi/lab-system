import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { slideCardModuleNames } from "@/modules/slide-card";
import { SlideCardBackendService } from "@/modules/slide-card/backend";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const slideCardService = backendContainer.get<SlideCardBackendService>(
  slideCardModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await slideCardService.findAll({ token, query });
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
    const image = body.get("Image");
    if (!(image instanceof File)) {
      throw new Error("Missing Image file");
    }

    const res = await slideCardService.create({
      token,
      title: String(body.get("Title") ?? ""),
      description: String(body.get("Description") ?? ""),
      price: Number(body.get("Price") ?? 0),
      discount: Number(body.get("Discount") ?? 0),
      expiryDate: String(body.get("ExpiryDate") ?? ""),
      badge: String(body.get("Badge") ?? ""),
      detailPageLink: String(body.get("DetailPageLink") ?? ""),
      displayOrder: Number(body.get("DisplayOrder") ?? 0),
      isActive: String(body.get("IsActive") ?? "false") === "true",
      image,
    });

    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
