"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";

const Init = ({
  children,
  isOpen,
  onClose,
  subscriptionPackage,
}: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("subscriptionPackage", subscriptionPackage);

  return <>{children}</>;
};

export { Init };
