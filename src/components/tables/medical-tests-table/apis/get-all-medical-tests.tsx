"use client";

import { frontendContainer } from "@/container";
import { MedicalTestFrontendService, medicalTestModuleNames } from "@/modules/medical-tests";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { MedicalTestsResponse } from "../types";
import { normalizeMedicalTestsResponse } from "./normalize-medical-tests-response";

const medicalTestService = frontendContainer.get<MedicalTestFrontendService>(
  medicalTestModuleNames.service,
);

async function getAllMedicalTests(params: {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDesc: boolean;
}): Promise<MedicalTestsResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: String(params.pageSize),
    SortDesc: String(params.sortDesc),
  };

  if (params.search.trim()) query.Search = params.search.trim();
  if (params.sortBy.trim()) query.SortBy = params.sortBy.trim();

  const payload = (await medicalTestService.findAll({ query })) as { data?: unknown };
  const inner = payload?.data;

  /* Backend may return either a plain list or a paginated object under `data`. */
  return normalizeMedicalTestsResponse(inner, {
    pageNumber: params.pageNumber,
    pageSize: params.pageSize,
  });
}

const GetAllMedicalTests = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const pageSize = useMirror("pageSize");
  const debouncedValue = useMirror("debouncedValue");
  const sortBy = useMirror("sortBy");
  const sortDesc = useMirror("sortDesc");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["medical-tests", pageNumber, pageSize, debouncedValue, sortBy, sortDesc],
    queryFn: () =>
      getAllMedicalTests({
        pageNumber,
        pageSize,
        search: debouncedValue,
        sortBy,
        sortDesc,
      }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("medicalTestsData", data ?? {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchMedicalTests", () => {
    void refetch();
  });

  return <>{props.children}</>;
};

export { GetAllMedicalTests };

