"use client";

import { frontendContainer } from "@/container";
import {
  subscriptionPackageModuleNames,
  SubscriptionPackageFrontendService,
} from "@/modules/subscription-package";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { SubscriptionPackagesResponse } from "../types";

const subscriptionPackageService =
  frontendContainer.get<SubscriptionPackageFrontendService>(
    subscriptionPackageModuleNames.service,
  );

async function getAllPackages(params: {
  pageNumber: number;
  targetAudience: string;
  isActive: "all" | "active" | "inactive";
}): Promise<SubscriptionPackagesResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "20",
  };

  if (params.targetAudience !== "all") {
    query.TargetAudience = params.targetAudience;
  }
  if (params.isActive === "active") {
    query.IsActive = "true";
  }
  if (params.isActive === "inactive") {
    query.IsActive = "false";
  }

  const payload = await subscriptionPackageService.findAll({ query });
  if (!payload) {
    throw new Error("Failed to fetch subscription packages");
  }
  return payload;
}

const GetAllPackages = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const targetAudienceFilter = useMirror("targetAudienceFilter");
  const isActiveFilter = useMirror("isActiveFilter");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["subscription-packages", pageNumber, targetAudienceFilter, isActiveFilter],
    queryFn: () =>
      getAllPackages({
        pageNumber,
        targetAudience: targetAudienceFilter,
        isActive: isActiveFilter,
      }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("packagesData", data ?? {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchPackages", () => {
    void refetch();
  });

  return props;
};

export { GetAllPackages };
