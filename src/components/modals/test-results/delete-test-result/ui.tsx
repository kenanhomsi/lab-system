"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";
import type { TestResultItem } from "@/components/tables/test-results-table/types";

const UI = () => {
  const t = useTranslations("admin.testResults");
  const tc = useTranslations("admin.common");

  const props = useMirror("props") as {
    opened?: boolean;
    onClose?: () => void;
    testResult?: Pick<TestResultItem, "id" | "testRequestId"> | null;
  };
  const submitAction = useMirror("submitAction") as (id: string) => Promise<unknown>;
  const onClose = props.onClose || (() => {});

  const confirmMessage =
    props.testResult?.testRequestId != null
      ? t("deleteConfirmMessage", { id: props.testResult.testRequestId })
      : t("deleteConfirmMessageNoId");

  return (
    <Modal opened={Boolean(props.opened)} onClose={onClose} title={t("deleteModalTitle")} centered>
      <Stack>
          <MutationErrorAlert />
        <Text size="sm" dir="auto">
          {confirmMessage}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button
            color="red"
            onClick={async () => {
              if (props.testResult?.id != null) {
                await submitAction(String(props.testResult.id));
                onClose();
              }
            }}
          >
            {tc("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
