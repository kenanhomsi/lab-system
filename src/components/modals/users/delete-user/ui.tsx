"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.users");
  const tc = useTranslations("admin.common");
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");
  const submit = useMirror("submit");
  const isSubmitting = useMirror("isSubmitting");

  const rawName = user?.fullName?.trim();
  const displayName = rawName && rawName.length > 0 ? rawName : t("deleteFallbackUser");

  return (
    <Modal opened={isOpen} onClose={onClose} title={t("deleteModalTitle")} centered>
      <Stack>
          <MutationErrorAlert />
        <Text size="sm" dir="auto">
          {t("deleteConfirmMessage", { name: displayName })}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button color="red" onClick={submit} loading={isSubmitting} disabled={!user}>
            {tc("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
