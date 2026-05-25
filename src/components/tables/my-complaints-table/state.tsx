"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("isCreateModalOpen", isCreateModalOpen);
  useMirrorRegistry("setIsCreateModalOpen", setIsCreateModalOpen);

  return <>{children}</>;
};

export { State };
