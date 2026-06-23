"use client";

import { PropsWithChildren, useState } from "react";
import type { AdItem, AdModalType } from "./types";
import { useMirrorRegistry } from "./store";

/**
 * Registers local state used by the ads management table.
 */
const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeModal, setActiveModal] = useState<AdModalType>(null);
  const [selectedAd, setSelectedAd] = useState<AdItem | null>(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedAd", selectedAd);
  useMirrorRegistry("setSelectedAd", setSelectedAd);

  return <>{children}</>;
};

export { State };
