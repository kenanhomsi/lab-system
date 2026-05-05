"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchTestResults = useMirror("refetchTestResults");

  useEventObserver("testResultCreatedSuccessfully", () => {
    refetchTestResults();
  });
  useEventObserver("testResultUpdatedSuccessfully", () => {
    refetchTestResults();
  });
  useEventObserver("testResultDeletedSuccessfully", () => {
    refetchTestResults();
  });

  return <>{children}</>;
};

export { Observer };
