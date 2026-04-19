"use client";

import { useMirror as useTableMirror } from "@/components/tables/permissions-table/store";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const permission = useMirror("permission");
  const onClose = useMirror("onClose");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const deletePermissionApi = useTableMirror("deletePermission");

  const submit = async () => {
    if (!permission) return;

    setIsSubmitting(true);
    try {
      await deletePermissionApi(permission.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("deletePermissionApi", deletePermissionApi);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Api };
