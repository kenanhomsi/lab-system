"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { QuickActionUrlListener } from "@/hooks/quick-action-url-listener";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchMedicalTests = useMirror("refetchMedicalTests");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedMedicalTest = useMirror("setSelectedMedicalTest");

  const openCreateModal = () => {
    setSelectedMedicalTest(null);
    setActiveModal("create");
  };

  useEventObserver("medicalTestCreatedSuccessfully", () => {
    refetchMedicalTests();
  });
  useEventObserver("medicalTestUpdatedSuccessfully", () => {
    refetchMedicalTests();
  });
  useEventObserver("medicalTestDeletedSuccessfully", () => {
    refetchMedicalTests();
  });

  return (
    <>
      <QuickActionUrlListener modal="create" onOpen={openCreateModal} />
      {children}
    </>
  );
};

export { Observer };
