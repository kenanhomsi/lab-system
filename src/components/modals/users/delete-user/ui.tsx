"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMirror } from "./store";

const UI = () => {
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");
  const submit = useMirror("submit");
  const isSubmitting = useMirror("isSubmitting");

  return (
    <Modal opened={isOpen} onClose={onClose} title="Delete User" centered>
      <Stack>
        <Text size="sm">
          Are you sure you want to delete <b>{user?.fullName || "this user"}</b>?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={submit} loading={isSubmitting} disabled={!user}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
