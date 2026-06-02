"use client";

import { frontendContainer } from "@/container";
import { VacantJobFrontendService, vacantJobModuleNames } from "@/modules/vacant-jobs";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { VacantJobsResponse } from "../types";
import { normalizeVacantJobsResponse } from "./normalize-vacant-jobs-response";

const vacantJobService = frontendContainer.get<VacantJobFrontendService>(
  vacantJobModuleNames.service,
);

async function getAllVacantJobs(params: {
  pageNumber: number;
  pageSize: number;
}): Promise<VacantJobsResponse> {
  const query: Record<string, string> = {
    page: String(params.pageNumber),
    pageSize: String(params.pageSize),
    includeInactive: "true",
  };

  const payload = await vacantJobService.findAll({ query });
  return normalizeVacantJobsResponse(payload, {
    pageNumber: params.pageNumber,
    pageSize: params.pageSize,
  });
}

const GetAllVacantJobs = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const pageSize = useMirror("pageSize");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["vacant-jobs", pageNumber, pageSize],
    queryFn: () => getAllVacantJobs({ pageNumber, pageSize }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry(
    "vacantJobsData",
    data ?? {
      items: [],
      page: 1,
      pageSize: 20,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  );
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchVacantJobs", () => {
    void refetch();
  });

  return <>{props.children}</>;
};

export { GetAllVacantJobs };
