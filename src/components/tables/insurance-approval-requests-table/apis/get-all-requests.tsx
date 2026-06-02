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

async function fetchAllRequests(params: {
  pageNumber: number;
  search: string;
  status: string;
}): Promise<InsuranceApprovalListResponse> {
  const query: Record<string, string> = {
    page: String(params.pageNumber),
    pageSize: String(PAGE_SIZE),
  };
  const searchTrim = params.search.trim();
  if (searchTrim) {
    query.search = searchTrim;
  }
  if (params.status !== "all") {
    query.status = params.status;
  }

  const payload = await service.findAll({ query });
  if (!payload) {
    throw new Error("Failed to fetch insurance approval requests");
  }
  return payload;
}

const GetAllInsuranceApprovalRequests = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["insurance-approval-requests", pageNumber, debouncedValue, statusFilter],
    queryFn: () =>
      fetchAllRequests({
        pageNumber,
        search: debouncedValue,
        status: statusFilter,
      }),
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

export { GetAllInsuranceApprovalRequests };
