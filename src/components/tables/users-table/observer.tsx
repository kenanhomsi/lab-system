"use client";

import { useEventObserver } from "@/hooks/events-observer";
import { QuickActionUrlListener } from "@/hooks/quick-action-url-listener";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = (props: PropsWithChildren) => {
  const { children } = props;
  const refetchUsers = useMirror("refetchUsers");
  const setActiveModal = useMirror("setActiveModal");

  const openCreateModal = () => setActiveModal("create");

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

  return (
    <>
      <QuickActionUrlListener modal="create" onOpen={openCreateModal} />
      {children}
    </>
  );
};

export default Observer