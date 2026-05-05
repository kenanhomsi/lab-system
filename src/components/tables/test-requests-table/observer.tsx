"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const refetchTestRequests = useMirror("refetchTestRequests");

  useEventObserver("testRequestCreatedSuccessfully", () => {
    refetchTestRequests();
  });
  useEventObserver("testRequestUpdatedSuccessfully", () => {
    refetchTestRequests();
  });
  useEventObserver("testRequestDeletedSuccessfully", () => {
    refetchTestRequests();
  });

  return <>{children}</>;
};

export { Observer };
