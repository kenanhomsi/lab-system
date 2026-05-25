"use client";

import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMutationError } from "@/hooks/mutation-error-context";

export function MutationErrorAlert() {
  const t = useTranslations("errors");
  const { error } = useMutationError();

  if (!error) {
    return null;
  }

  return (
    <Alert
      color="red"
      variant="light"
      icon={<IconAlertCircle size={16} />}
      title={t("alertTitle")}
      mb="md"
    >
      {error}
    </Alert>
  );
}
