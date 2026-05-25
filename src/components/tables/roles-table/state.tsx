"use client";

import { PropsWithChildren, useState } from "react";
import { RoleModalType, RoleTableItem } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeModal, setActiveModal] = useState<RoleModalType>(null);
  const [selectedRole, setSelectedRole] = useState<RoleTableItem | null>(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedRole", selectedRole);
  useMirrorRegistry("setSelectedRole", setSelectedRole);

  return <>{children}</>;
};

export { State };
