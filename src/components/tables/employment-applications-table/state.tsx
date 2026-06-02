"use client";

import { useDebouncedValue, useMounted } from "@mantine/hooks";
import { PropsWithChildren, useState } from "react";
import type { EmploymentApplicationStatus } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const isHydrated = useMounted();

  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EmploymentApplicationStatus>("all");
  const [statusUpdateTargetId, setStatusUpdateTargetId] = useState<number | null>(null);
  const [statusUpdateIntent, setStatusUpdateIntent] = useState<EmploymentApplicationStatus | null>(
    null,
  );

  const [debouncedValue] = useDebouncedValue(searchValue, 500);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("statusFilter", statusFilter);
  useMirrorRegistry("setStatusFilter", setStatusFilter);
  useMirrorRegistry("statusUpdateTargetId", statusUpdateTargetId);
  useMirrorRegistry("setStatusUpdateTargetId", setStatusUpdateTargetId);
  useMirrorRegistry("statusUpdateIntent", statusUpdateIntent);
  useMirrorRegistry("setStatusUpdateIntent", setStatusUpdateIntent);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};

export { State };
