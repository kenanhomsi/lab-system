"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";
import { useMirrorRegistry } from "./store";
import { TestResultItem } from "./types";

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedTestResult, setSelectedTestResult] = useState<TestResultItem | null>(null);
  const [selectedTestResultIds, setSelectedTestResultIds] = useState<number[]>([]);
  const [activeModal, setActiveModal] = useState<null | "create" | "edit" | "delete" | "view">(null);
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
  useMirrorRegistry("selectedTestResult", selectedTestResult);
  useMirrorRegistry("setSelectedTestResult", setSelectedTestResult);
  useMirrorRegistry("selectedTestResultIds", selectedTestResultIds);
  useMirrorRegistry("setSelectedTestResultIds", setSelectedTestResultIds);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);

  return <>{children}</>;
};

export { State };
