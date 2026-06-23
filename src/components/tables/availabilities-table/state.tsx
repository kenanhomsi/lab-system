"use client";

import { PropsWithChildren, useState } from "react";
import type { AvailabilityModalType, AvailabilityRow } from "./types";
import { useMirrorRegistry } from "./store";

/**
 * Registers local state used by the availabilities management table.
 */
const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [activeModal, setActiveModal] = useState<AvailabilityModalType>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityRow | null>(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedAvailability", selectedAvailability);
  useMirrorRegistry("setSelectedAvailability", setSelectedAvailability);

  return <>{children}</>;
};

export { State };
