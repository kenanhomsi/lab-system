"use client";

import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const user = useMirror("user");
  const onClose = useMirror("onClose");
  const rolesText = useMirror("rolesText");
  const setRolesText = useMirror("setRolesText");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const assignRolesApi = useMirror("assignRolesApi");
  const removeRolesApi = useMirror("removeRolesApi");

  const parseRoles = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const assign = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await assignRolesApi({ id: user.id, roles: parseRoles(rolesText) });
      setRolesText("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await removeRolesApi({ id: user.id, roles: parseRoles(rolesText) });
      setRolesText("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("parseRoles", parseRoles);
  useMirrorRegistry("assign", assign);
  useMirrorRegistry("remove", remove);

  return <>{children}</>;
};

export { Utils };
