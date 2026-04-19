"use client";

import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useMirror } from "./store";

const UI = () => {
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");
  const permissionsText = useMirror("permissionsText");
  const setPermissionsText = useMirror("setPermissionsText");
  const loadedPermissions = useMirror("loadedPermissions");
  const isSubmitting = useMirror("isSubmitting");
  const assign = useMirror("assign");
  const replace = useMirror("replace");
  const removeOne = useMirror("removeOne");

  return (
    <Modal opened={isOpen} onClose={onClose} title="Manage Permissions" centered>
      <Stack>
        <Text size="sm">User: {user?.fullName || "-"}</Text>
        <Text size="sm">Current: {loadedPermissions.join(", ") || "No permissions found"}</Text>
        <TextInput
          label="Permissions (comma separated)"
          value={permissionsText}
          onChange={(event) => setPermissionsText(event.target.value)}
          placeholder="users.read,users.write"
        />
        <Group justify="space-between" wrap="wrap">
          <Button
            variant="default"
            onClick={removeOne}
            loading={isSubmitting}
            disabled={!user || !permissionsText.trim()}
          >
            Remove First Permission
          </Button>
          <Group>
            <Button
              variant="default"
              onClick={replace}
              loading={isSubmitting}
              disabled={!user || !permissionsText.trim()}
            >
              Replace
            </Button>
            <Button onClick={assign} loading={isSubmitting} disabled={!user || !permissionsText.trim()}>
              Assign
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
