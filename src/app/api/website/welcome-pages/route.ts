import { NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { welcomePageModuleNames } from "@/modules/welcome-page";
import { WelcomePageBackendService } from "@/modules/welcome-page/backend";

const welcomePageService = backendContainer.get<WelcomePageBackendService>(
  welcomePageModuleNames.service,
);
const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
};

export async function GET() {
  try {
    const res = await welcomePageService.findAllPublic();
    return NextResponse.json(res, { headers: PUBLIC_CACHE_HEADERS });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
