"use client";

import { frontendContainer } from "@/container";
import { ComplaintFrontendService, complaintModuleNames } from "@/modules/complaint";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { ComplaintStatus } from "@/lib/complaint-status";
import { ComplaintItem, ComplaintsResponse } from "../types";

const complaintService = frontendContainer.get<ComplaintFrontendService>(
  complaintModuleNames.service,
);

const PAGE_SIZE = 20;
const FETCH_PAGE_SIZE = 10;

async function fetchAllComplaints(): Promise<ComplaintItem[]> {
  const payload = await complaintService.findAll({
    query: {
      Page: "1",
      PageSize: String(FETCH_PAGE_SIZE),
    },
  });

  if (!payload) {
    throw new Error("Failed to fetch complaints");
  }

  return payload.items ?? [];
}

function filterComplaints(
  items: ComplaintItem[],
  params: {
    search: string;
    status: "all" | ComplaintStatus;
    userId: string;
  },
): ComplaintItem[] {
  const search = params.search.trim().toLowerCase();
  const userId = params.userId.trim().toLowerCase();

  return items.filter((item) => {
    if (params.status !== "all" && item.status !== params.status) {
      return false;
    }

    if (userId && !item.userId.toLowerCase().includes(userId)) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [item.title, item.description, item.userId].join(" ").toLowerCase();
    return haystack.includes(search);
  });
}

function paginateComplaints(
  items: ComplaintItem[],
  pageNumber: number,
  pageSize: number,
): ComplaintsResponse {
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize) || 1);
  const page = Math.min(Math.max(1, pageNumber), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

const GetAllComplaints = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");
  const userIdFilter = useMirror("userIdFilter");

  const { data: allItems = [], isPending, refetch } = useQuery({
    queryKey: ["complaints"],
    queryFn: fetchAllComplaints,
    refetchInterval: 1000 * 60,
  });

  const complaintsData = useMemo(() => {
    const filtered = filterComplaints(allItems, {
      search: debouncedValue,
      status: statusFilter,
      userId: userIdFilter,
    });

    return paginateComplaints(filtered, pageNumber, PAGE_SIZE);
  }, [allItems, debouncedValue, statusFilter, userIdFilter, pageNumber]);

  useMirrorRegistry("complaintsData", complaintsData);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchComplaints", () => {
    void refetch();
  });

  return props;
};

export { GetAllComplaints };
