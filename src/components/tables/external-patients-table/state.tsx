"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";
import { useMirrorRegistry } from "./store";
import type { ExternalPatientRow } from "./types";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<ExternalPatientRow | null>(null);
  const [activeModal, setActiveModal] = useState<"create" | "view" | "link" | null>(null);
  const [debouncedValue] = useDebouncedValue(searchValue, 400);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("pageSize", pageSize);
  useMirrorRegistry("setPageSize", () => {});
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("selectedPatient", selectedPatient);
  useMirrorRegistry("setSelectedPatient", setSelectedPatient);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
