"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = (props: PropsWithChildren) => {
  const { children } = props;
  const refetchComplaints = useMirror("refetchComplaints");

  useEventObserver("complaintStatusUpdatedSuccessfully", () => {
    void refetchComplaints();
  });

  return <>{children}</>;
};

export default Observer;
