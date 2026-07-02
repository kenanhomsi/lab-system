import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { slideCardModuleNames } from "@/modules/slide-card";
import { SlideCardBackendService } from "@/modules/slide-card/backend";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const slideCardService = backendContainer.get<SlideCardBackendService>(
  slideCardModuleNames.service,
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id } = await context.params;
    const res = await slideCardService.findOne({ token, id });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id } = await context.params;
    const formData = await req.formData();
    const image = formData.get("Image");

    const res = await slideCardService.update({
      token,
      id,
      title: String(formData.get("Title") ?? ""),
      description: String(formData.get("Description") ?? ""),
      price: Number(formData.get("Price") ?? 0),
      discount: Number(formData.get("Discount") ?? 0),
      expiryDate: String(formData.get("ExpiryDate") ?? ""),
      badge: String(formData.get("Badge") ?? ""),
      detailPageLink: String(formData.get("DetailPageLink") ?? ""),
      displayOrder: Number(formData.get("DisplayOrder") ?? 0),
      isActive: String(formData.get("IsActive") ?? "true") === "true",
      image: image instanceof File && image.size > 0 ? image : undefined,
    });
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
    await slideCardService.delete({ token, id });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
