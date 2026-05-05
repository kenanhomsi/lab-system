"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";
import { useMirrorRegistry } from "./store";
import { TestRequestItem } from "./types";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedTestRequest, setSelectedTestRequest] = useState<TestRequestItem | null>(null);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit" | "delete">(null);
  const [debouncedValue] = useDebouncedValue(searchValue, 500);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("pageSize", pageSize);
  useMirrorRegistry("setPageSize", setPageSize);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("sortBy", sortBy);
  useMirrorRegistry("setSortBy", setSortBy);
  useMirrorRegistry("sortDesc", sortDesc);
  useMirrorRegistry("setSortDesc", setSortDesc);
  useMirrorRegistry("selectedTestRequest", selectedTestRequest);
  useMirrorRegistry("setSelectedTestRequest", setSelectedTestRequest);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
