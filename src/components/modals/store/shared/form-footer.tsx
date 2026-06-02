"use client";

import { Button, Group } from "@mantine/core";
import { useTranslations } from "next-intl";

type FormFooterProps = {
  onCancel: () => void;
  onSave: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  saveLabel?: string;
};

/**
 * Standard cancel/save footer for store admin form modals.
 */
export function StoreFormFooter({
  onCancel,
  onSave,
  isSubmitting = false,
  canSubmit = true,
  saveLabel,
}: FormFooterProps) {
  const tc = useTranslations("admin.common");

  return (
    <Group justify="flex-end" mt="sm">
      <Button variant="default" onClick={onCancel} disabled={isSubmitting}>
        {tc("cancel")}
      </Button>
      <Button
        color="teal"
        disabled={!canSubmit || isSubmitting}
        loading={isSubmitting}
        onClick={onSave}
      >
        {saveLabel ?? tc("save")}
      </Button>
    </Group>
  );
}
