"use client";

import { PropsWithChildren, useState } from "react";
import { PermissionItem, PermissionModalType } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeModal, setActiveModal] = useState<PermissionModalType>(null);
  const [selectedPermission, setSelectedPermission] = useState<PermissionItem | null>(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedPermission", selectedPermission);
  useMirrorRegistry("setSelectedPermission", setSelectedPermission);

  return <>{children}</>;
};

export { State };
