import { NextResponse } from "next/server";
import type { SubscriptionPackageItem } from "@/components/tables/subscription-packages-table/types";
import { backendContainer } from "@/container";
import {
  SubscriptionPackageBackendService,
  subscriptionPackageModuleNames,
} from "@/modules/subscription-package";

const packageService = backendContainer.get<SubscriptionPackageBackendService>(
  subscriptionPackageModuleNames.service,
);

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
    const list = await packageService.findAllPublic({
      query: { IsActive: "true", PageSize: "20", Page: "1" },
    });
    const items = list.items ?? [];
    return NextResponse.json(filterPublicPackages(items));
  } catch {
    return NextResponse.json([]);
  }
}
