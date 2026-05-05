"use client";

import { frontendContainer } from "@/container";
import type { TestRequestItem } from "@/components/tables/test-requests-table/types";
import { TestRequestFrontendService, testRequestModuleNames } from "@/modules/TestRequests";
import { useQuery } from "@tanstack/react-query";

const service = frontendContainer.get<TestRequestFrontendService>(
  testRequestModuleNames.service,
);

/** Backend responds with `{ success, message, data: TestRequestItem[] }` or a bare array. */
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

async function fetchTestRequestsForSelect(): Promise<TestRequestItem[]> {
  const payload = await service.findAll({
    query: {
      Page: "1",
      PageSize: "500",
      SortBy: "createdAt",
      SortDesc: "true",
    },
  });
  return extractRows(payload);
}

function testRequestOptionLabel(row: TestRequestItem): string {
  const patient = row.externalPatientFullName?.trim() ?? "";
  const test = row.medicalTestNameEn?.trim() ?? "";
  const parts = [`#${row.id}`, patient || null, test || null].filter(Boolean);
  return parts.join(" · ");
}

function useTestRequestsForSelectQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["test-result-form", "test-requests-options"],
    queryFn: fetchTestRequestsForSelect,
    enabled,
    staleTime: 60_000,
  });
}

export { extractRows, fetchTestRequestsForSelect, testRequestOptionLabel, useTestRequestsForSelectQuery };
