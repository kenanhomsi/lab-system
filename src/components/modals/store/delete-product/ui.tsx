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
  const product = useMirror("product");
  const submit = useMirror("submit");
  const isSubmitting = useMirror("isSubmitting");

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <StoreModalHeader
          icon={<IconTrash size={22} />}
          title={t("deleteProductModalTitle")}
          subtitle={t("deleteProductModalSubtitle")}
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
          {t("deleteProductConfirm")}
        </Text>
        <Text fw={600} dir="auto">
          {product?.nameAr?.trim() || "—"}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Button color="red" onClick={() => void submit()} loading={isSubmitting} disabled={!product}>
            {tc("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
