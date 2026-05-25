import { type NextRequest, NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { fetchMetwaliBlogPosts } from "@/lib/server/metwali-blog";

function parseLocale(raw: string | null): AppLocale {
  if (raw === "ar" || raw === "en") return raw;
  return routing.defaultLocale;
}

export async function GET(req: NextRequest) {
  const locale = parseLocale(req.nextUrl.searchParams.get("locale"));
  const result = await fetchMetwaliBlogPosts(locale);
  return NextResponse.json(result);
}
