import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  WEBSITE_PAGES_CACHE_TAG,
  WEBSITE_PAGES_NAVIGATION_CACHE_TAG,
} from "@/lib/website-pages/cache";
import { pageModuleNames } from "@/modules/pages";
import { PageBackendService } from "@/modules/pages/backend";
import type { PageUpsertRequest } from "@/types/website-page";
import { pageUpsertSchema } from "./schema";

const pageService = backendContainer.get<PageBackendService>(
  pageModuleNames.service,
);

function revalidateWebsitePages() {
  revalidateTag(WEBSITE_PAGES_CACHE_TAG, "max");
  revalidateTag(WEBSITE_PAGES_NAVIGATION_CACHE_TAG, "max");
}

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await pageService.findAll({ token, query });
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
    const input = pageUpsertSchema.parse(await req.json()) as PageUpsertRequest;
    const res = await pageService.create({ token, ...input });
    revalidateWebsitePages();
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
