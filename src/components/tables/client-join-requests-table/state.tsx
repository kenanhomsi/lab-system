"use client";

import { useDebouncedValue, useMounted } from "@mantine/hooks";
import { PropsWithChildren, useState } from "react";
import type { ClientJoinRequestItem, ClientJoinRequestStatus } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const isHydrated = useMounted();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ClientJoinRequestStatus>("all");
  const [selectedRequest, setSelectedRequest] = useState<ClientJoinRequestItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusUpdateTargetId, setStatusUpdateTargetId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [debouncedValue] = useDebouncedValue(searchValue, 500);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("statusFilter", statusFilter);
  useMirrorRegistry("setStatusFilter", setStatusFilter);
  useMirrorRegistry("selectedRequest", selectedRequest);
  useMirrorRegistry("setSelectedRequest", setSelectedRequest);
  useMirrorRegistry("isDetailModalOpen", isDetailModalOpen);
  useMirrorRegistry("setIsDetailModalOpen", setIsDetailModalOpen);
  useMirrorRegistry("statusUpdateTargetId", statusUpdateTargetId);
  useMirrorRegistry("setStatusUpdateTargetId", setStatusUpdateTargetId);
  useMirrorRegistry("deleteTargetId", deleteTargetId);
  useMirrorRegistry("setDeleteTargetId", setDeleteTargetId);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};

export { State };
