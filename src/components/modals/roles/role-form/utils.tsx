"use client";

import { CreateRoleRequest, UpdateRoleRequest } from "@/components/tables/roles-table/types";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const role = useMirror("role");
  const onClose = useMirror("onClose");
  const name = useMirror("name");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createRoleApi = useMirror("createRoleApi");
  const updateRoleApi = useMirror("updateRoleApi");

  const canSubmit = useMemo(() => Boolean(name.trim()), [name]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      if (role) {
        const payload: UpdateRoleRequest = { name };
        await updateRoleApi(role.id, payload);
      } else {
        const payload: CreateRoleRequest = { name };
        await createRoleApi(payload);
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
