"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  STORE_DELETE_MODAL_SIZE,
  STORE_GLASS_MODAL_STYLES,
  STORE_GLASS_OVERLAY_PROPS,
  StoreModalHeader,
} from "../shared";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const tc = useTranslations("admin.common");
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const category = useMirror("category");
  const submit = useMirror("submit");
  const isSubmitting = useMirror("isSubmitting");

  const displayName = category?.nameAr?.trim() || "—";

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <StoreModalHeader
          icon={<IconTrash size={22} />}
          title={t("deleteCategoryModalTitle")}
          subtitle={t("deleteCategoryModalSubtitle")}
          color="red"
        />
      }
      centered
      size={STORE_DELETE_MODAL_SIZE}
      radius="xl"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={STORE_GLASS_OVERLAY_PROPS}
      styles={STORE_GLASS_MODAL_STYLES}
    >
      <Stack gap="md">
        <MutationErrorAlert />
        <Text size="sm" dir="auto">
          {t("deleteCategoryConfirm")}
        </Text>
        <Text fw={600} dir="auto">
          {displayName}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Button color="red" onClick={() => void submit()} loading={isSubmitting} disabled={!category}>
            {tc("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
