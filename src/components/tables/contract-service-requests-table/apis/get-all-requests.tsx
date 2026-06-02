"use client";

import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import type { ContractServiceRequestItem, ContractServiceRequestList } from "../types";

const PAGE_SIZE = 20;

async function fetchAllRequests(params: {
  pageNumber: number;
  status: string;
}): Promise<ContractServiceRequestList> {
  const query: Record<string, string> = {
    page: String(params.pageNumber),
    pageSize: String(PAGE_SIZE),
  };
  if (params.status !== "all") {
    query.status = params.status;
  }

  const { data } = await axiosInstanceFront.get<ContractServiceRequestList>(
    "/contract-service-requests",
    { params: query },
  );
  return data;
}

function filterBySearch(
  items: ContractServiceRequestItem[],
  search: string,
): ContractServiceRequestItem[] {
  const term = search.trim().toLowerCase();
  if (!term) return items;

  return items.filter((item) => {
    const haystack = [
      item.responsibleName,
      item.organizationName,
      item.contactNumber,
      item.email,
      item.address,
      item.contractType,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

const GetAllContractServiceRequests = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["contract-service-requests", pageNumber, statusFilter],
    queryFn: () =>
      fetchAllRequests({
        pageNumber,
        status: statusFilter,
      }),
    refetchInterval: 1000 * 60,
  });

  const requestsData = useMemo(() => {
    const base = data ?? {
      items: [],
      page: 1,
      pageSize: PAGE_SIZE,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
    const filteredItems = filterBySearch(base.items ?? [], debouncedValue);
    return { ...base, items: filteredItems };
  }, [data, debouncedValue]);

  useMirrorRegistry("requestsData", requestsData);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchRequests", () => {
    void refetch();
  });

  return props;
};

export { GetAllContractServiceRequests };
