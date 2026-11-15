import { NextResponse } from "next/server";
import type { SubscriptionPackageItem } from "@/components/tables/subscription-packages-table/types";
import { unwrapUpstreamPayload } from "@/lib/api/unwrap-upstream-payload";

const filterPublicPackages = (items: SubscriptionPackageItem[]) =>
  items
    .filter(
      (pkg) =>
        pkg.isActive &&
        (pkg.targetAudience === "All" || pkg.targetAudience === "Patient"),
    )
    .sort((a, b) => a.price - b.price);

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const response = await fetch(`${backendUrl}/api/subscriptions/packages`, {
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json([], { status: response.status });
    const payload = unwrapUpstreamPayload(await response.json());
    const items = Array.isArray(payload) ? (payload as SubscriptionPackageItem[]) : [];
    return NextResponse.json(filterPublicPackages(items));
  } catch {
    return NextResponse.json([]);
  }
}
