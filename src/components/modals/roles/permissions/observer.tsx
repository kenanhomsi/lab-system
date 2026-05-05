"use client";

import { PropsWithChildren, useEffect } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const role = useMirror("role");
  const rolePermissions = useMirror("rolePermissions");
  const setInitialIds = useMirror("setInitialIds");
  const setCheckedIds = useMirror("setCheckedIds");
  const setSearch = useMirror("setSearch");

  useEffect(() => {
    if (!isOpen) {
      setInitialIds([]);
      setCheckedIds([]);
      setSearch("");
    }
  }, [isOpen, setInitialIds, setCheckedIds, setSearch]);

  useEffect(() => {
    if (!isOpen || !role) return;
    const ids = rolePermissions.map((p) => p.id);
    setInitialIds(ids);
    setCheckedIds(ids);
  }, [isOpen, role, rolePermissions, setInitialIds, setCheckedIds]);

  return <>{children}</>;
};

export { Observer };
