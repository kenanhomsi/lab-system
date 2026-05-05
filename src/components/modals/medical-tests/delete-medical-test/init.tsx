"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";

const Init = ({
  children,
  opened,
  onClose,
}: PropsWithChildren<Pick<FactoryProps, "opened" | "onClose">>) => {
  useMirrorRegistry("isOpen", opened);
  useMirrorRegistry("onClose", onClose ?? (() => {}));

  return <>{children}</>;
};

export { Init };
