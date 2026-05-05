"use client";

import { frontendContainer } from "@/container";
import { TestRequestFrontendService, testRequestModuleNames } from "@/modules/TestRequests";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { TestRequestItem, TestRequestsResponse } from "../types";

const service = frontendContainer.get<TestRequestFrontendService>(testRequestModuleNames.service);

/** Backend responds with `{ success, message, data: TestRequestItem[] }` (no paging wrapper). */
function extractRows(payload: unknown): TestRequestItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: TestRequestItem[] }).data;
  }
  throw new Error("Failed to fetch test requests");
}

function sortItems(items: TestRequestItem[], sortBy: string, sortDesc: boolean): TestRequestItem[] {
  const key = sortBy.trim() || "createdAt";
  const dir = sortDesc ? -1 : 1;
  const time = (v: string | undefined) => {
    const t = v ? new Date(v).getTime() : NaN;
    return Number.isFinite(t) ? t : 0;
  };
  return [...items].sort((a, b) => {
    let cmp = 0;
    if (key === "totalAmount") {
      cmp = a.totalAmount - b.totalAmount;
    } else if (key === "requestDate") {
      cmp = time(a.requestDate) - time(b.requestDate);
    } else if (key === "createdAt") {
      cmp = time(a.createdAt) - time(b.createdAt);
    } else {
      cmp = String(a[key as keyof TestRequestItem] ?? "").localeCompare(String(b[key as keyof TestRequestItem] ?? ""));
    }
    return cmp * dir;
  });
}

function filterBySearch(items: TestRequestItem[], search: string): TestRequestItem[] {
  const q = search.trim();
  if (!q) return items;
  const asNum = Number(q);
  if (!Number.isNaN(asNum)) {
    return items.filter((row) => row.medicalTestId === asNum || row.id === asNum);
  }
  const lower = q.toLowerCase();
  return items.filter((row) => {
    const name = row.medicalTestNameEn?.toLowerCase() ?? "";
    const patient = row.externalPatientFullName?.toLowerCase() ?? "";
    return name.includes(lower) || patient.includes(lower);
  });
}

function toPagedResponse(
  items: TestRequestItem[],
  pageNumber: number,
  pageSize: number,
): TestRequestsResponse {
  const totalCount = items.length;
  const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const safePage = totalPages > 0 ? Math.min(Math.max(1, pageNumber), totalPages) : 1;
  const start = (safePage - 1) * pageSize;
  const pageItems = pageSize > 0 ? items.slice(start, start + pageSize) : items;

  return {
    items: pageItems,
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: totalPages > 0 && safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
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
    const asMedicalTestId = Number(searchTrim);
    if (!Number.isNaN(asMedicalTestId)) {
      query.MedicalTestId = searchTrim;
    }
  }
  if (params.sortBy.trim()) query.SortBy = params.sortBy.trim();

  const payload = await service.findAll({ query });
  const rows = extractRows(payload);
  const filtered = filterBySearch(rows, params.search);
  const sorted = sortItems(filtered, params.sortBy, params.sortDesc);
  return toPagedResponse(sorted, params.pageNumber, params.pageSize);
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
