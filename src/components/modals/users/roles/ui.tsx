"use client";

import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useMirror } from "./store";

const UI = () => {
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");
  const rolesText = useMirror("rolesText");
  const setRolesText = useMirror("setRolesText");
  const isSubmitting = useMirror("isSubmitting");
  const assign = useMirror("assign");
  const remove = useMirror("remove");

  return (
    <Modal opened={isOpen} onClose={onClose} title="Manage Roles" centered>
      <Stack>
        <Text size="sm">User: {user?.fullName || "-"}</Text>
        <TextInput
          label="Roles (comma separated)"
          value={rolesText}
          onChange={(event) => setRolesText(event.target.value)}
          placeholder="admin,doctor"
        />
        <Group justify="space-between">
          <Button
            variant="default"
            onClick={remove}
            loading={isSubmitting}
            disabled={!user || !rolesText.trim()}
          >
            Remove Roles
          </Button>
          <Button onClick={assign} loading={isSubmitting} disabled={!user || !rolesText.trim()}>
            Assign Roles
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
