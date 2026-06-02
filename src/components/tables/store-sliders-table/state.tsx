"use client";

import { useState } from "react";
import type { StoreSlider } from "@/modules/store";
import { useMirrorRegistry } from "./store";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedSlider, setSelectedSlider] = useState<StoreSlider | null>(null);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit">(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("selectedSlider", selectedSlider);
  useMirrorRegistry("setSelectedSlider", setSelectedSlider);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
