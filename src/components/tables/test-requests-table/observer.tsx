"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { QuickActionUrlListener } from "@/hooks/quick-action-url-listener";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchTestRequests = useMirror("refetchTestRequests");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedTestRequest = useMirror("setSelectedTestRequest");

  const openCreateModal = () => {
    setSelectedTestRequest(null);
    setActiveModal("create");
  };

  useEventObserver("testRequestCreatedSuccessfully", () => {
    refetchTestRequests();
  });
  useEventObserver("testRequestUpdatedSuccessfully", () => {
    refetchTestRequests();
  });
  useEventObserver("testRequestDeletedSuccessfully", () => {
    refetchTestRequests();
  });

  return (
    <>
      <QuickActionUrlListener modal="create" onOpen={openCreateModal} />
      {children}
    </>
  );
};

export { Observer };
