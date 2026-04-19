"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { PropsWithChildren, useState } from "react";
import { UserItem, UserModalType } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDesc, setSortDesc] = useState(true);

  const [activeModal, setActiveModal] = useState<UserModalType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const [debouncedValue] = useDebouncedValue(searchValue, 500);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("searchValue", searchValue);
  useMirrorRegistry("setSearchValue", setSearchValue);
  useMirrorRegistry("debouncedValue", debouncedValue);
  useMirrorRegistry("roleFilter", roleFilter);
  useMirrorRegistry("setRoleFilter", setRoleFilter);
  useMirrorRegistry("isActiveFilter", isActiveFilter);
  useMirrorRegistry("setIsActiveFilter", setIsActiveFilter);
  useMirrorRegistry("sortBy", sortBy);
  useMirrorRegistry("setSortBy", setSortBy);
  useMirrorRegistry("sortDesc", sortDesc);
  useMirrorRegistry("setSortDesc", setSortDesc);

  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedUser", selectedUser);
  useMirrorRegistry("setSelectedUser", setSelectedUser);

  return <>{children}</>;
};

export { State };
