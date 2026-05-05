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
