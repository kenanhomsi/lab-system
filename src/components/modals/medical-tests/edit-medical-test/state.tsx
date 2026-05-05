"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";
import type { MedicalTest } from "@/types/test";

const State = ({
  children,
  medicalTest,
}: PropsWithChildren<{ medicalTest: MedicalTest | null }>) => {
  const [nameAr, setNameAr] = useState(() => medicalTest?.nameAr || "");
  const [nameEn, setNameEn] = useState(() => medicalTest?.nameEn || "");
  const [description, setDescription] = useState(() => medicalTest?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useMirrorRegistry("medicalTest", medicalTest);
  useMirrorRegistry("nameAr", nameAr);
  useMirrorRegistry("setNameAr", setNameAr);
  useMirrorRegistry("nameEn", nameEn);
  useMirrorRegistry("setNameEn", setNameEn);
  useMirrorRegistry("description", description);
  useMirrorRegistry("setDescription", setDescription);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
