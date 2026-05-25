"use client";

import { QuickActionUrlListener } from "@/hooks/quick-action-url-listener";
import { PropsWithChildren } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedPackage = useMirror("setSelectedPackage");

  const openCreateModal = () => {
    setSelectedPackage(null);
    setActiveModal("create");
  };

  return (
    <>
      <QuickActionUrlListener modal="create" onOpen={openCreateModal} />
      {children}
    </>
  );
};

export default Observer;
