"use client";

import { useState } from "react";
import type { MedicalTestCategory } from "@/modules/medical-test-categories";
import { useMirrorRegistry } from "./store";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<MedicalTestCategory | null>(null);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit" | "delete">(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("selectedCategory", selectedCategory);
  useMirrorRegistry("setSelectedCategory", setSelectedCategory);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
