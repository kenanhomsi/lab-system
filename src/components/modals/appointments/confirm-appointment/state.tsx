"use client";

import { PropsWithChildren, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onClose = useMirror("onClose");

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);
  useMirrorRegistry("handleClose", handleClose);

  return <>{children}</>;
};

export { State };
