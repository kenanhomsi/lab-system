"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";
import type { MedicalTest } from "@/types/test";

const State = ({
  children,
  medicalTest,
}: PropsWithChildren<{ medicalTest: MedicalTest | null }>) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    useMirrorRegistry("isSubmitting", isSubmitting);
    useMirrorRegistry("setIsSubmitting", setIsSubmitting);
    useMirrorRegistry("medicalTest", medicalTest);

    return <>{children}</>;
};

export { State };
