"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";

const Init = ({
  children,
  isOpen,
  onClose,
  permission,
}: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("permission", permission);

  return <>{children}</>;
};

export { Init };
