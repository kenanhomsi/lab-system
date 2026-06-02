"use client";

import { frontendContainer } from "@/container";
import { MedicalTestFrontendService, medicalTestModuleNames } from "@/modules/medical-tests";
import { useQuery } from "@tanstack/react-query";
import { normalizeMedicalTestsResponse } from "@/components/tables/medical-tests-table/apis/normalize-medical-tests-response";
import type { MedicalTestsResponse } from "./types";

const medicalTestService = frontendContainer.get<MedicalTestFrontendService>(
  medicalTestModuleNames.service,
);

type UseMedicalTestsCatalogQueryParams = {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDesc: boolean;
};

async function getAllMedicalTests(params: UseMedicalTestsCatalogQueryParams): Promise<MedicalTestsResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: String(params.pageSize),
    SortDesc: String(params.sortDesc),
  };

  if (params.search.trim()) query.Search = params.search.trim();
  if (params.sortBy.trim()) query.SortBy = params.sortBy.trim();

  const payload = (await medicalTestService.findAll({ query })) as { data?: unknown };
  return normalizeMedicalTestsResponse(payload?.data, {
    pageNumber: params.pageNumber,
    pageSize: params.pageSize,
  });
}

function useMedicalTestsCatalogQuery(params: UseMedicalTestsCatalogQueryParams) {
  return useQuery({
    queryKey: [
      "medical-tests-catalog",
      params.pageNumber,
      params.pageSize,
      params.search,
      params.sortBy,
      params.sortDesc,
    ],
    queryFn: () => getAllMedicalTests(params),
    refetchInterval: 1000 * 60,
  });
}

export { useMedicalTestsCatalogQuery };
