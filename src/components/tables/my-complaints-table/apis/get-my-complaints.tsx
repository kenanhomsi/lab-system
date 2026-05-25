"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { ComplaintsResponse } from "../types";

function unwrapComplaintsResponse(payload: unknown): ComplaintsResponse {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data: unknown }).data !== null &&
    typeof (payload as { data: unknown }).data === "object" &&
    Array.isArray((payload as { data: { items?: unknown } }).data.items)
  ) {
    return (payload as { data: ComplaintsResponse }).data;
  }

  return payload as ComplaintsResponse;
}

async function getMyComplaints(pageNumber: number): Promise<ComplaintsResponse> {
  const params = new URLSearchParams({
    page: String(pageNumber),
    pageSize: "20",
  });

  const response = await fetch(`/api/me/complaints?${params.toString()}`);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return unwrapComplaintsResponse(payload);
}

const GetMyComplaints = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["my-complaints", pageNumber],
    queryFn: () => getMyComplaints(pageNumber),
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

export { GetMyComplaints };
