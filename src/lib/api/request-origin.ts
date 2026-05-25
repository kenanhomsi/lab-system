import { headers } from "next/headers";

/** Base URL for same-origin fetch from Server Components / generateMetadata */
export async function getRequestOrigin(): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  if (host) {
    return `${proto.split(",")[0].trim()}://${host.split(",")[0].trim()}`;
  }
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (base) return base;
  return `http://127.0.0.1:${process.env.PORT ?? "3000"}`;
}
