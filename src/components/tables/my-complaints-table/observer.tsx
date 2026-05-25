"use client";

import { QuickActionUrlListener } from "@/hooks/quick-action-url-listener";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const setIsCreateModalOpen = useMirror("setIsCreateModalOpen");

  const openCreateModal = () => setIsCreateModalOpen(true);

  return (
    <>
      <QuickActionUrlListener modal="create" onOpen={openCreateModal} />
      {children}
    </>
  );
};

export default Observer;
