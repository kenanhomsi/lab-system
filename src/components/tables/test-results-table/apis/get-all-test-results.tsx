"use client";

import { frontendContainer } from "@/container";
import { TestResultFrontendService, testResultModuleNames } from "@/modules/TestResults";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { TestResultItem, TestResultsResponse } from "../types";

const service = frontendContainer.get<TestResultFrontendService>(testResultModuleNames.service);

function sortItems(
  items: TestResultItem[],
  sortBy: string,
  sortDesc: boolean,
): TestResultItem[] {
  const key = sortBy as keyof TestResultItem;
  return [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av ?? "").localeCompare(String(bv ?? ""));
    return sortDesc ? -cmp : cmp;
  });
}

function toPaginatedResponse(
  items: TestResultItem[],
  pageNumber: number,
  pageSize: number,
  sortBy: string,
  sortDesc: boolean,
): TestResultsResponse {
  const sorted = sortItems(items, sortBy, sortDesc);
  const totalCount = sorted.length;
  const totalPages =
    totalCount === 0 ? 0 : Math.max(1, Math.ceil(totalCount / pageSize));
  const page =
    totalPages === 0 ? 1 : Math.min(Math.max(1, pageNumber), totalPages);
  const start = (page - 1) * pageSize;
  const slice = sorted.slice(start, start + pageSize);
  return {
    items: slice,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: totalPages > 0 && page < totalPages,
    hasPreviousPage: page > 1,
  };
}

function toTrimmedString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function normalizeTestResultItem(raw: unknown): TestResultItem {
  if (raw === null || typeof raw !== "object") {
    return {
      id: 0,
      testRequestId: 0,
      resultDate: "",
      resultData: "",
      pdfUrl: "",
      status: "",
      createdAt: "",
      updatedAt: "",
    };
  }
  const r = raw as Record<string, unknown>;
  return {
    id: Number(r.id) || 0,
    testRequestId: Number(r.testRequestId) || 0,
    resultDate: toTrimmedString(r.resultDate),
    resultData: toTrimmedString(r.resultData),
    pdfUrl: toTrimmedString(r.pdfUrl),
    status: toTrimmedString(r.status),
    createdAt: toTrimmedString(r.createdAt),
    updatedAt: toTrimmedString(r.updatedAt),
  };
}

async function fetchTestResultsList(search: string): Promise<TestResultItem[]> {
  const query: Record<string, string> = {};
  const trimmed = search.trim();
  if (trimmed && /^\d+$/.test(trimmed)) {
    query.testRequestId = trimmed;
  }

  const payload = await service.findAll({ query });
  const list = payload.data ?? [];
  return list.map(normalizeTestResultItem);
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

  const { data: rawList = [], isPending, refetch } = useQuery({
    queryKey: ["test-results", debouncedValue],
    queryFn: () => fetchTestResultsList(debouncedValue),
    refetchInterval: 1000 * 60,
  });
  const testResultsData = useMemo(
    () =>
      toPaginatedResponse(rawList, pageNumber, pageSize, sortBy, sortDesc),
    [rawList, pageNumber, pageSize, sortBy, sortDesc],
  );

  useMirrorRegistry("testResultsData", testResultsData ?? emptyResponse);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchTestResults", () => {
    void refetch();
  });

  return <>{props.children}</>;
};

export { GetAllTestResults };
