"use client";

import { storeService } from "@/components/features/store";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const t = useTranslations("labStore.admin");
  const queryClient = useQueryClient();
  const product = useMirror("product");
  const onClose = useMirror("onClose");
  const setIsSubmitting = useMirror("setIsSubmitting");

  const deleteMutation = useManagedMutation({
    mutationFn: (id: number) => storeService.deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["store", "admin", "products"] });
    },
  });

  const submit = async () => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      await deleteMutation.mutateAsync(product.id);
      notifications.show({ title: t("saved"), message: t("productDeleted"), color: "green" });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("submit", submit);

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
