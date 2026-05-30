"use client";

import { frontendContainer } from "@/container";
import { getMedicalTestNamesLabel } from "@/components/tables/test-requests-table/get-medical-test-names-label";
import type { TestRequestItem } from "@/components/tables/test-requests-table/types";
import { TestRequestFrontendService, testRequestModuleNames } from "@/modules/TestRequests";
import { useQuery } from "@tanstack/react-query";

const service = frontendContainer.get<TestRequestFrontendService>(
  testRequestModuleNames.service,
);

/** Accept bare arrays plus legacy/new paginated envelopes from the backend/BFF. */
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
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data: unknown }).data !== null &&
    typeof (payload as { data: unknown }).data === "object" &&
    Array.isArray(
      ((payload as { data: Record<string, unknown> }).data as Record<string, unknown>).items,
    )
  ) {
    return ((payload as { data: { items: TestRequestItem[] } }).data.items ?? []);
  }
  if (
    payload !== null &&
    typeof payload === "object" &&
    Array.isArray((payload as { items?: unknown }).items)
  ) {
    return (payload as { items: TestRequestItem[] }).items;
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
  const patient =
    row.externalPatientFullName?.trim() ||
    row.patientName?.trim() ||
    "";
  let test = getMedicalTestNamesLabel(row);
  if (!test && row.tests && row.tests.length > 0) {
    test = `${row.tests.length} tests`;
  }
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
