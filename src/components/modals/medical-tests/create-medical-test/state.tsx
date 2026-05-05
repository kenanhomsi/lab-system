"use client";

import { useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: { children: React.ReactNode }) => {
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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