"use client";

import { frontendContainer } from "@/container";
import {
  ExternalPatientsFrontendService,
  externalPatientsModuleNames,
} from "@/modules/ExternalPatients";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import type { ExternalPatientsPageData } from "../types";

const service = frontendContainer.get<ExternalPatientsFrontendService>(
  externalPatientsModuleNames.service,
);

const emptyPageData = (): ExternalPatientsPageData => ({
  items: [],
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

const GetAllExternalPatients = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const pageSize = useMirror("pageSize");
  const debouncedValue = useMirror("debouncedValue");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["external-patients", pageNumber, pageSize, debouncedValue],
    queryFn: () =>
      service.findAll({
        page: pageNumber,
        pageSize,
        search: debouncedValue,
      }),
  });

  useMirrorRegistry("externalPatientsData", data ?? emptyPageData());
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchExternalPatients", () => {
    void refetch();
  });

  return <>{props.children}</>;
};

export { GetAllExternalPatients };
