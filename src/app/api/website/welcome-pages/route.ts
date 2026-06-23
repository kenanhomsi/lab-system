import { NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { welcomePageModuleNames } from "@/modules/welcome-page";
import { WelcomePageBackendService } from "@/modules/welcome-page/backend";

const welcomePageService = backendContainer.get<WelcomePageBackendService>(
  welcomePageModuleNames.service,
);

export async function GET() {
  try {
    const res = await welcomePageService.findAllPublic();
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
