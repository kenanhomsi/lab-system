"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchVacantJobs = useMirror("refetchVacantJobs");

  useEventObserver("vacantJobCreatedSuccessfully", () => {
    refetchVacantJobs();
  });
  useEventObserver("vacantJobUpdatedSuccessfully", () => {
    refetchVacantJobs();
  });
  useEventObserver("vacantJobDeletedSuccessfully", () => {
    refetchVacantJobs();
  });

  return <>{children}</>;
};

export { Observer };
