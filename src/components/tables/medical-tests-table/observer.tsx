"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchMedicalTests = useMirror("refetchMedicalTests");

  useEventObserver("medicalTestCreatedSuccessfully", () => {
    refetchMedicalTests();
  });
  useEventObserver("medicalTestUpdatedSuccessfully", () => {
    refetchMedicalTests();
  });
  useEventObserver("medicalTestDeletedSuccessfully", () => {
    refetchMedicalTests();
  });

  return <>{children}</>;
};

export { Observer };
