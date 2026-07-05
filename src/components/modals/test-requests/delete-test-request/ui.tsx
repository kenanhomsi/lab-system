"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.testRequests");
  const props = useMirror("props") as {
    opened?: boolean;
    onClose?: () => void;
    testRequest?: { id: number; medicalTestNameEn?: string } | null;
  };
  const submitAction = useMirror("submitAction") as (id: string) => Promise<unknown>;
  const onClose = props.onClose || (() => {});

  return (
    <Modal opened={Boolean(props.opened)} onClose={onClose} title={t("deleteModalTitle")} centered>
      <Stack>
        <MutationErrorAlert />
        <Text>
          {t("deleteConfirmMessage", {
            name: props.testRequest?.medicalTestNameEn || t("thisRequest"),
          })}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            color="red"
            onClick={async () => {
              if (props.testRequest?.id) {
                await submitAction(String(props.testRequest.id));
                onClose();
              }
            }}
          >
            {t("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
