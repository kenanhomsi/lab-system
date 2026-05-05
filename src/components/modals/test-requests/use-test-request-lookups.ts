"use client";

import { frontendContainer } from "@/container";
import { normalizeMedicalTestsResponse } from "@/components/tables/medical-tests-table/apis/normalize-medical-tests-response";
import type { MedicalTestItem } from "@/components/tables/medical-tests-table/types";
import type { ExternalPatient } from "@/modules/ExternalPatients/backend/types";
import {
  ExternalPatientsFrontendClient,
  externalPatientsModuleNames,
} from "@/modules/ExternalPatients";
import {
  MedicalTestFrontendService,
  medicalTestModuleNames,
} from "@/modules/medical-tests";
import { useQuery } from "@tanstack/react-query";

const medicalTestService = frontendContainer.get<MedicalTestFrontendService>(
  medicalTestModuleNames.service,
);
const externalPatientsClient = frontendContainer.get<ExternalPatientsFrontendClient>(
  externalPatientsModuleNames.client,
);

/**
 * Frontend `findAll` returns `{ data: T }`; upstream/BFF sometimes nests again.
 * Normalizer expects a bare array or a paginated `{ items: [...] }` object.
 */
function unwrapMedicalTestsFindAllPayload(payload: unknown): unknown {
  if (payload === undefined || payload === null) return payload;
  if (Array.isArray(payload)) return payload;

  let current: unknown = payload;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object") return current;
    const o = current as Record<string, unknown>;

    if (Array.isArray(o.items)) return o;

    const d = o.data;
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object") {
      const nested = d as Record<string, unknown>;
      if (Array.isArray(nested.items)) return d;
      if (Array.isArray(nested.data)) return nested.data;
      current = d;
      continue;
    }
    return current;
  }
  return current;
}

async function fetchMedicalTestsForSelect(): Promise<MedicalTestItem[]> {
  /* Match medical-tests-table query keys; avoid SortBy values the API might reject (e.g. nameEn). */
  const rawUnknown: unknown = await medicalTestService.findAll({
    query: {
      Page: "1",
      PageSize: "500",
      SortBy: "createdAt",
      SortDesc: "true",
    },
  });
  const inner = unwrapMedicalTestsFindAllPayload(rawUnknown);

  const normalized = normalizeMedicalTestsResponse(inner, {
    pageNumber: 1,
    pageSize: 500,
  });
  return normalized.items;
}

async function fetchExternalPatients(): Promise<ExternalPatient[]> {
  const rows = await externalPatientsClient.findAll();
  return Array.isArray(rows) ? rows : [];
}

function useMedicalTestsForSelectQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["test-request-form", "medical-tests-options"],
    queryFn: fetchMedicalTestsForSelect,
    enabled,
    staleTime: 60_000,
  });
}

function useExternalPatientsForSelectQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["test-request-form", "external-patients-options"],
    queryFn: fetchExternalPatients,
    enabled,
    staleTime: 60_000,
  });
}

export {
  fetchExternalPatients,
  fetchMedicalTestsForSelect,
  useExternalPatientsForSelectQuery,
  useMedicalTestsForSelectQuery,
};
