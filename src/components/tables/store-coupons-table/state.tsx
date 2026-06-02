"use client";

import { useState } from "react";
import type { StoreCoupon } from "@/modules/store";
import { useMirrorRegistry } from "./store";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<StoreCoupon | null>(null);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit">(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("selectedCoupon", selectedCoupon);
  useMirrorRegistry("setSelectedCoupon", setSelectedCoupon);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
