"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = (props: PropsWithChildren) => {
  const { children } = props;
  const refetchUsers = useMirror("refetchUsers");

  useEventObserver("userCreatedSuccessfully", () => {
    void refetchUsers();
  });
  useEventObserver("userUpdatedSuccessfully", () => {
    void refetchUsers();
  });
  useEventObserver("userDeletedSuccessfully", () => {
    void refetchUsers();
  });
  useEventObserver("userActivatedSuccessfully", () => {
    void refetchUsers();
  });
  useEventObserver("userDeactivatedSuccessfully", () => {
    void refetchUsers();
  });

  return <>{children}</>;
};

export default Observer