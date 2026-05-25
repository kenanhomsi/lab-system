"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { QuickActionUrlListener } from "@/hooks/quick-action-url-listener";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchTestResults = useMirror("refetchTestResults");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedTestResult = useMirror("setSelectedTestResult");

  const openCreateModal = () => {
    setSelectedTestResult(null);
    setActiveModal("create");
  };

  useEventObserver("testResultCreatedSuccessfully", () => {
    refetchTestResults();
  });
  useEventObserver("testResultUpdatedSuccessfully", () => {
    refetchTestResults();
  });
  useEventObserver("testResultDeletedSuccessfully", () => {
    refetchTestResults();
  });

  return (
    <>
      <QuickActionUrlListener modal="create" onOpen={openCreateModal} />
      {children}
    </>
  );
};

export { Observer };
