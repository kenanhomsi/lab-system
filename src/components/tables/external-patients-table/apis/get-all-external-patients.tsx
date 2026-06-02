"use client";

import { frontendContainer } from "@/container";
import {
  ExternalPatientsFrontendService,
  externalPatientsModuleNames,
} from "@/modules/ExternalPatients";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import type { ExternalPatient } from "@/modules/ExternalPatients";
import type { ExternalPatientsPageData } from "../types";

const service = frontendContainer.get<ExternalPatientsFrontendService>(
  externalPatientsModuleNames.service,
);

function normalizeExternalPatientsList(payload: unknown): ExternalPatient[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.items)) return record.items as ExternalPatient[];

  const data = record.data;
  if (Array.isArray(data)) return data as ExternalPatient[];
  if (data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).items)) {
    return (data as { items: ExternalPatient[] }).items;
  }

  return [];
}

function filterPatients(
  list: ExternalPatient[],
  search: string,
) {
  const q = search.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => {
    const hay = [
      p.fullName,
      p.phoneNumber,
      p.externalId,
      String(p.id),
      p.linkedDirectPatientId ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

const GetAllExternalPatients = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const pageSize = useMirror("pageSize");
  const debouncedValue = useMirror("debouncedValue");

  const { data: list = [], isPending, refetch } = useQuery({
    queryKey: ["external-patients"],
    queryFn: async () => normalizeExternalPatientsList(await service.findAll()),
    refetchInterval: 1000 * 60,
  });

  const pageData = useMemo((): ExternalPatientsPageData => {
    const filtered = filterPatients(list, debouncedValue);
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize) || 1);
    const page = Math.min(Math.max(1, pageNumber), totalPages);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return {
      items,
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }, [list, debouncedValue, pageNumber, pageSize]);

  useMirrorRegistry("externalPatientsData", pageData);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchExternalPatients", () => {
    void refetch();
  });

  return <>{props.children}</>;
};

export { GetAllExternalPatients };
