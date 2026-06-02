"use client";

import { useState } from "react";
import type { StoreProduct } from "@/modules/store";
import { useMirrorRegistry } from "./store";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit" | "delete">(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("selectedProduct", selectedProduct);
  useMirrorRegistry("setSelectedProduct", setSelectedProduct);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
