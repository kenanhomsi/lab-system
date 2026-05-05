"use client";

import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const role = useMirror("role");
  const onClose = useMirror("onClose");
  const initialIds = useMirror("initialIds");
  const checkedIds = useMirror("checkedIds");
  const setCheckedIds = useMirror("setCheckedIds");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const search = useMirror("search");
  const catalogPermissions = useMirror("catalogPermissions");
  const assignRolePermissionApi = useMirror("assignRolePermissionApi");
  const removeRolePermissionApi = useMirror("removeRolePermissionApi");
  const refetchRolePermissions = useMirror("refetchRolePermissions");

  const filteredPermissions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return catalogPermissions;
    return catalogPermissions.filter((p) => {
      return (
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });
  }, [catalogPermissions, search]);

  const hasChanges = useMemo(() => {
    if (initialIds.length !== checkedIds.length) return true;
    const initialSet = new Set(initialIds);
    return checkedIds.some((id) => !initialSet.has(id));
  }, [initialIds, checkedIds]);

  const toggle = (permissionId: string) => {
    setCheckedIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const selectAll = () => {
    setCheckedIds(filteredPermissions.map((p) => p.id));
  };

  const clearAll = () => {
    setCheckedIds([]);
  };

  const submit = async () => {
    if (!role) return;
    const initialSet = new Set(initialIds);
    const checkedSet = new Set(checkedIds);
    const toAdd = checkedIds.filter((id) => !initialSet.has(id));
    const toRemove = initialIds.filter((id) => !checkedSet.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.all([
        ...toAdd.map((permissionId) =>
          assignRolePermissionApi(role.id, permissionId),
        ),
        ...toRemove.map((permissionId) =>
          removeRolePermissionApi(role.id, permissionId),
        ),
      ]);
      refetchRolePermissions();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("filteredPermissions", filteredPermissions);
  useMirrorRegistry("hasChanges", hasChanges);
  useMirrorRegistry("toggle", toggle);
  useMirrorRegistry("selectAll", selectAll);
  useMirrorRegistry("clearAll", clearAll);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Utils };
