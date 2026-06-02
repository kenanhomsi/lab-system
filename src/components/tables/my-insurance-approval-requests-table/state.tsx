"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("isCreateModalOpen", isCreateModalOpen);
  useMirrorRegistry("setIsCreateModalOpen", setIsCreateModalOpen);
  useMirrorRegistry("isDetailModalOpen", isDetailModalOpen);
  useMirrorRegistry("setIsDetailModalOpen", setIsDetailModalOpen);
  useMirrorRegistry("selectedRequestId", selectedRequestId);
  useMirrorRegistry("setSelectedRequestId", setSelectedRequestId);
  useMirrorRegistry("deleteTargetId", deleteTargetId);
  useMirrorRegistry("setDeleteTargetId", setDeleteTargetId);

  return <>{children}</>;
};

export { State };
