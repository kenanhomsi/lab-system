"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";

const Init = ({ isOpen, onClose, user, children }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("user", user);

  return <>{children}</>;
};

export { Init };
