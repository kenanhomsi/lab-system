"use client";

import { frontendContainer } from "@/container";
import { TestResultFrontendService, testResultModuleNames } from "@/modules/TestResults";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { TestResultsResponse } from "../types";

const service = frontendContainer.get<TestResultFrontendService>(testResultModuleNames.service);

function extractResponse(payload: unknown): TestResultsResponse {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    typeof (payload as Record<string, unknown>).data === "object" &&
    (payload as Record<string, unknown>).data !== null &&
    "items" in ((payload as Record<string, unknown>).data as Record<string, unknown>)
  ) {
    return (payload as Record<string, unknown>).data as TestResultsResponse;
  }

  if (payload !== null && typeof payload === "object" && "items" in payload) {
    return payload as TestResultsResponse;
  }

  throw new Error("Failed to fetch test results");
}

async function fetchTestResultsList(params: {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDesc: boolean;
}): Promise<TestResultsResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: String(params.pageSize),
    SortDesc: String(params.sortDesc),
  };

  const trimmed = params.search.trim();
  if (trimmed && /^\d+$/.test(trimmed)) {
    query.TestRequestId = trimmed;
  }
  if (params.sortBy.trim()) query.SortBy = params.sortBy.trim();

  const payload = await service.findAll({ query });
  return extractResponse(payload);
}

const emptyResponse: TestResultsResponse = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const GetAllTestResults = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const pageSize = useMirror("pageSize");
  const debouncedValue = useMirror("debouncedValue");
  const sortBy = useMirror("sortBy");
  const sortDesc = useMirror("sortDesc");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["test-results", pageNumber, pageSize, debouncedValue, sortBy, sortDesc],
    queryFn: () => fetchTestResultsList({ pageNumber, pageSize, search: debouncedValue, sortBy, sortDesc }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("testResultsData", data ?? emptyResponse);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchTestResults", () => {
    void refetch();
  });

  return <>{props.children}</>;
};

export { GetAllTestResults };
