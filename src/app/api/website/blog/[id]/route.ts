import { type NextRequest, NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { fetchMetwaliPostById } from "@/lib/server/metwali-blog";

function parseLocale(raw: string | null): AppLocale {
  if (raw === "ar" || raw === "en") return raw;
  return routing.defaultLocale;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const locale = parseLocale(req.nextUrl.searchParams.get("locale"));
  const post = await fetchMetwaliPostById(numId, locale);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}
