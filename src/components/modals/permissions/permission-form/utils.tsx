"use client";

import {
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "@/components/tables/permissions-table/types";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const permission = useMirror("permission");
  const onClose = useMirror("onClose");
  const name = useMirror("name");
  const description = useMirror("description");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createPermissionApi = useMirror("createPermissionApi");
  const updatePermissionApi = useMirror("updatePermissionApi");

  const canSubmit = useMemo(() => {
    if (permission) {
      return Boolean(description.trim());
    }

    return Boolean(name.trim() && description.trim());
  }, [description, name, permission]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      if (permission) {
        const payload: UpdatePermissionRequest = { description };
        await updatePermissionApi(permission.id, payload);
      } else {
        const payload: CreatePermissionRequest = { name, description };
        await createPermissionApi(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("canSubmit", canSubmit);
  useMirrorRegistry("handleClose", handleClose);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Utils };
