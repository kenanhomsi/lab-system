"use client";

import { frontendContainer } from "@/container";
import {
  InsuranceApprovalRequestFrontendService,
  insuranceApprovalRequestModuleNames,
} from "@/modules/insurance-approval-request";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import type { InsuranceApprovalListResponse } from "../types";

const service = frontendContainer.get<InsuranceApprovalRequestFrontendService>(
  insuranceApprovalRequestModuleNames.service,
);

const PAGE_SIZE = 20;

async function fetchMyRequests(pageNumber: number): Promise<InsuranceApprovalListResponse> {
  const payload = await service.findMine({
    query: {
      page: String(pageNumber),
      pageSize: String(PAGE_SIZE),
    },
  });
  if (!payload) {
    throw new Error("Failed to fetch insurance approval requests");
  }
  return payload;
}

const GetMyInsuranceApprovalRequests = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["my-insurance-approval-requests", pageNumber],
    queryFn: () => fetchMyRequests(pageNumber),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry(
    "requestsData",
    data ?? {
      items: [],
      page: 1,
      pageSize: PAGE_SIZE,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  );
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchRequests", () => {
    void refetch();
  });

  return props;
};

export { GetMyInsuranceApprovalRequests };
