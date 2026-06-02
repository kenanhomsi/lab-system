"use client";

import { useState } from "react";
import type { StoreBanner } from "@/modules/store";
import { useMirrorRegistry } from "./store";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedBanner, setSelectedBanner] = useState<StoreBanner | null>(null);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit">(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("selectedBanner", selectedBanner);
  useMirrorRegistry("setSelectedBanner", setSelectedBanner);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
