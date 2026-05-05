"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);
  useMirrorRegistry("form", {
    medicalTestId: 0,
    requestDate: "",
    status: "pending",
    totalAmount: 0,
    notes: "",
    metadata: "",
    doctorId: "",
    labClientId: "",
    directPatientId: "",
    externalPatientId: 0,
  });
  return <>{children}</>;
};

export { State };
