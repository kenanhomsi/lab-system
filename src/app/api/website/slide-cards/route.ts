import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { slideCardModuleNames } from "@/modules/slide-card";
import { SlideCardBackendService } from "@/modules/slide-card/backend";

const slideCardService = backendContainer.get<SlideCardBackendService>(
  slideCardModuleNames.service,
);

export async function GET() {
  try {
    const res = await slideCardService.findAllPublic({});
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
