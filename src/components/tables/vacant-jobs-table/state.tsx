"use client";

import { useState } from "react";
import { useMirrorRegistry } from "./store";
import { VacantJobItem } from "./types";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedVacantJob, setSelectedVacantJob] = useState<VacantJobItem | null>(null);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit" | "delete">(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("pageSize", pageSize);
  useMirrorRegistry("setPageSize", setPageSize);
  useMirrorRegistry("selectedVacantJob", selectedVacantJob);
  useMirrorRegistry("setSelectedVacantJob", setSelectedVacantJob);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
