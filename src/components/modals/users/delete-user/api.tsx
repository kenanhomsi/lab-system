"use client";

import { frontendContainer } from "@/container";
import { DeleteUserCommand, userModuleNames } from "@/modules/user";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const deleteUserCommand = frontendContainer.get<DeleteUserCommand>(
  userModuleNames.deleteUserCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const user = useMirror("user");
  const onClose = useMirror("onClose");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const deleteMutation = useManagedMutation({
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

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
