import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { toWebsitePageLanguage } from "@/lib/website-pages/language";
import { pageModuleNames } from "@/modules/pages";
import { PageBackendService } from "@/modules/pages/backend";

const pageService = backendContainer.get<PageBackendService>(
  pageModuleNames.service,
);

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const language = toWebsitePageLanguage(
      req.nextUrl.searchParams.get("language") ?? "en",
    );
    const res = await pageService.findPublicPage({ slug, language });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
