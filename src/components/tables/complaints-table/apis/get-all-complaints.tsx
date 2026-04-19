"use client";

import { frontendContainer } from "@/container";
import { ComplaintFrontendService, complaintModuleNames } from "@/modules/complaint";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { ComplaintsResponse } from "../types";

const complaintService = frontendContainer.get<ComplaintFrontendService>(
  complaintModuleNames.service,
);

async function getAllComplaints(params: {
  pageNumber: number;
  search: string;
  status: "all" | "received" | "in_progress" | "resolved";
  userId: string;
}): Promise<ComplaintsResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "20",
  };

  if (params.search.trim()) query.Search = params.search.trim();
  if (params.status !== "all") query.Status = params.status;
  if (params.userId.trim()) query.UserId = params.userId.trim();

  const payload = await complaintService.findAll({ query });
  if (!payload) {
    throw new Error("Failed to fetch complaints");
  }
  return payload;
}

const GetAllComplaints = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");
  const userIdFilter = useMirror("userIdFilter");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["complaints", pageNumber, debouncedValue, statusFilter, userIdFilter],
    queryFn: () =>
      getAllComplaints({
        pageNumber,
        search: debouncedValue,
        status: statusFilter,
        userId: userIdFilter,
      }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry(
    "complaintsData",
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
  useMirrorRegistry("refetchComplaints", () => {
    void refetch();
  });

  return props;
};

export { GetAllComplaints };
