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
import { pageUpsertSchema } from "../schema";

const pageService = backendContainer.get<PageBackendService>(
  pageModuleNames.service,
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parsePageId(id: string): number {
  const pageId = Number(id);
  if (!Number.isInteger(pageId) || pageId <= 0) {
    throw new Error("Invalid page ID");
  }
  return pageId;
}

function revalidateWebsitePages() {
  revalidateTag(WEBSITE_PAGES_CACHE_TAG, "max");
  revalidateTag(WEBSITE_PAGES_NAVIGATION_CACHE_TAG, "max");
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const res = await pageService.findOne({ token, id: parsePageId(id) });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const input = pageUpsertSchema.parse(await req.json()) as PageUpsertRequest;
    const res = await pageService.update({
      token,
      id: parsePageId(id),
      ...input,
    });
    revalidateWebsitePages();
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
    await pageService.delete({ token, id: parsePageId(id) });
    revalidateWebsitePages();
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
