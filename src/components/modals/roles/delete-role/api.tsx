"use client";

import { useMirror as useTableMirror } from "@/components/tables/roles-table/store";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const role = useMirror("role");
  const onClose = useMirror("onClose");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const deleteRoleApi = useTableMirror("deleteRole");

  const submit = async () => {
    if (!role) return;

    setIsSubmitting(true);
    try {
      await deleteRoleApi(role.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("deleteRoleApi", deleteRoleApi);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Api };
