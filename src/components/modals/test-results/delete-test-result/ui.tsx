"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMirror } from "./store";
import type { TestResultItem } from "@/components/tables/test-results-table/types";

const UI = () => {
  const props = useMirror("props") as {
    opened?: boolean;
    onClose?: () => void;
    testResult?: Pick<TestResultItem, "id" | "testRequestId"> | null;
  };
  const submitAction = useMirror("submitAction") as (id: string) => Promise<unknown>;
  const onClose = props.onClose || (() => {});

  return (
    <Modal opened={Boolean(props.opened)} onClose={onClose} title="Delete test result" centered>
      <Stack>
        <Text>
          Are you sure you want to delete this test result
          {props.testResult?.testRequestId != null
            ? ` (test request ${props.testResult.testRequestId})`
            : ""}
          ?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
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
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
