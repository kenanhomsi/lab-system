"use client";

import { frontendContainer } from "@/container";
import { DeleteUserCommand, userModuleNames } from "@/modules/user";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const deleteUserCommand = frontendContainer.get<DeleteUserCommand>(
  userModuleNames.deleteUserCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const user = useMirror("user");
  const onClose = useMirror("onClose");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      deleteUserCommand.init({ id });
      return deleteUserCommand.exec();
    },
  });

  const submitDelete = async (id: string) => deleteMutation.mutateAsync(id);

  const submit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitDelete(user.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("submitDelete", submitDelete);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Api };
