"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = (props: PropsWithChildren) => {
  const { children } = props;
  const refetchAppointments = useMirror("refetchAppointments");

  useEventObserver("appointmentCreatedSuccessfully", () => {
    void refetchAppointments();
  });

  return <>{children}</>;
};

export default Observer;
