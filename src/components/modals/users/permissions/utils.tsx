"use client";

import { PropsWithChildren, useEffect } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const user = useMirror("user");
  const onClose = useMirror("onClose");
  const permissionsText = useMirror("permissionsText");
  const setLoadedPermissions = useMirror("setLoadedPermissions");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const getPermissionsApi = useMirror("getPermissionsApi");
  const assignPermissionsApi = useMirror("assignPermissionsApi");
  const replacePermissionsApi = useMirror("replacePermissionsApi");
  const removePermissionApi = useMirror("removePermissionApi");
  const loadedPermissions = useMirror("loadedPermissions");
  const setCheckedPermissions = useMirror("setCheckedPermissions");
  useEffect(() => {
    // Only update if different to avoid infinite loop
    setCheckedPermissions((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(loadedPermissions)) {
        return loadedPermissions;
      }
      return prev;
    });
  }, [loadedPermissions, setCheckedPermissions]);
  const parsePermissions = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const loadPermissions = async () => {
    if (!user) {
      setLoadedPermissions([]);
      return;
    }
    const payload = await getPermissionsApi(user.id);
    setLoadedPermissions(payload.permissions || []);
  };

  const assign = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await assignPermissionsApi({
        id: user.id,
        permissions: parsePermissions(permissionsText),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const replace = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await replacePermissionsApi({
        id: user.id,
        permissions: parsePermissions(permissionsText),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeOne = async () => {
    if (!user) return;
    const firstPermission = parsePermissions(permissionsText)[0];
    if (!firstPermission) return;
    setIsSubmitting(true);
    try {
      await removePermissionApi({ id: user.id, permission: firstPermission });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("parsePermissions", parsePermissions);
  useMirrorRegistry("loadPermissions", loadPermissions);
  useMirrorRegistry("assign", assign);
  useMirrorRegistry("replace", replace);
  useMirrorRegistry("removeOne", removeOne);

  return <>{children}</>;
};

export { Utils };
