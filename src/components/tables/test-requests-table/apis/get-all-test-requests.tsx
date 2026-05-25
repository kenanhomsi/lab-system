"use client";

import { frontendContainer } from "@/container";
import { TestRequestFrontendService, testRequestModuleNames } from "@/modules/TestRequests";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { TestRequestsResponse } from "../types";

const service = frontendContainer.get<TestRequestFrontendService>(testRequestModuleNames.service);

/** Backend responds with `{ success, message, data: TestRequestsResponse }` */
function extractResponse(payload: unknown): TestRequestsResponse {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    typeof (payload as Record<string, unknown>).data === "object" &&
    (payload as Record<string, unknown>).data !== null &&
    "items" in ((payload as Record<string, unknown>).data as Record<string, unknown>)
  ) {
    return (payload as Record<string, unknown>).data as TestRequestsResponse;
  }

  if (payload !== null && typeof payload === "object" && "items" in payload) {
    return payload as TestRequestsResponse;
  }

  throw new Error("Failed to fetch test requests");
}

async function getAllTestRequests(params: {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDesc: boolean;
}): Promise<TestRequestsResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: String(params.pageSize),
    SortDesc: String(params.sortDesc),
  };

  const searchTrim = params.search.trim();
  if (searchTrim) {
    const useMedicalTestId =
      /^\d+$/.test(searchTrim) &&
      Number.isSafeInteger(Number(searchTrim)) &&
      String(Number(searchTrim)) === searchTrim;
    if (useMedicalTestId) {
      query.MedicalTestId = searchTrim;
    } else {
      query.Search = searchTrim;
    }
  }
  if (params.sortBy.trim()) query.SortBy = params.sortBy.trim();

  const payload = await service.findAll({ query });
  return extractResponse(payload);
}

const GetAllTestRequests = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const pageSize = useMirror("pageSize");
  const debouncedValue = useMirror("debouncedValue");
  const sortBy = useMirror("sortBy");
  const sortDesc = useMirror("sortDesc");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["test-requests", pageNumber, pageSize, debouncedValue, sortBy, sortDesc],
    queryFn: () => getAllTestRequests({ pageNumber, pageSize, search: debouncedValue, sortBy, sortDesc }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("testRequestsData", data ?? {
    items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchTestRequests", () => { void refetch(); });

  return <>{props.children}</>;
};

export { GetAllTestRequests };
