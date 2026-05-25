"use client";

import { useDebouncedValue, useMounted } from "@mantine/hooks";
import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";
import { ComplaintItem, ComplaintStatus } from "./types";

const State = ({ children }: PropsWithChildren) => {
  const isHydrated = useMounted();

  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ComplaintStatus>("all");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  const [debouncedValue] = useDebouncedValue(searchValue, 500);


  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("statusFilter", statusFilter);
  useMirrorRegistry("setStatusFilter", setStatusFilter);
  useMirrorRegistry("userIdFilter", userIdFilter);
  useMirrorRegistry("setUserIdFilter", setUserIdFilter);
  useMirrorRegistry("selectedComplaint", selectedComplaint);
  useMirrorRegistry("setSelectedComplaint", setSelectedComplaint);
  if (!isHydrated) {
    return null;
  }
  return <>{children}</>;
};

export { State };
