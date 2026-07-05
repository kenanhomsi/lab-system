"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { QuickActionUrlListener } from "@/hooks/quick-action-url-listener";
import { useSessionUserStore } from "@/stores/session-user-store";
import { getTestResultPermissions } from "./test-result-permissions";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchTestResults = useMirror("refetchTestResults");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedTestResult = useMirror("setSelectedTestResult");
  const roles = useSessionUserStore((s) => s.user?.roles);
  const permissions = useSessionUserStore((s) => s.user?.permissions);
  const { canCreate } = getTestResultPermissions(roles, permissions);

  const openCreateModal = () => {
    if (!canCreate) return;
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
      {canCreate ? (
        <QuickActionUrlListener modal="create" onOpen={openCreateModal} />
      ) : null}
      {children}
    </>
  );
};

export { Observer };
