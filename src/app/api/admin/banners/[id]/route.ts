import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { bannerModuleNames } from "@/modules/banner";
import { BannerBackendService } from "@/modules/banner/backend";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const bannerService = backendContainer.get<BannerBackendService>(
  bannerModuleNames.service,
);

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, context: RouteContext) {
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
      body = await req.formData();
    } else {
      body = (await req.json()) as Record<string, unknown>;
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
