"use client";

import { useState } from "react";
import type { StoreCategory } from "@/modules/store";
import { useMirrorRegistry } from "./store";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | null>(null);
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
