"use client";

import { Button, Checkbox, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
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
  const checkedPermissions = useMirror("checkedPermissions");
  const setCheckedPermissions = useMirror("setCheckedPermissions");

  return (
    <Modal opened={isOpen} onClose={onClose} title="Manage Permissions" centered>
      <Stack>
        <Text size="sm">User: {user?.fullName || "-"}</Text>
        <Text size="sm" mb={4}>Current Permissions:</Text>
        <Stack gap={4} mb={8}>
          {loadedPermissions.length === 0 && <Text size="sm">No permissions found</Text>}
          {loadedPermissions.map((perm) => (
            <Checkbox
              key={perm}
              label={perm}
              checked={checkedPermissions.includes(perm)}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedPermissions((prev) => [...prev, perm]);
                } else {
                  setCheckedPermissions((prev) => prev.filter((p) => p !== perm));
                }
              }}
            />
          ))}
        </Stack>
        <TextInput
          label="Add New Permission"
          value={permissionsText}
          onChange={(event) => setPermissionsText(event.target.value)}
          placeholder="users.read"
        />
        <Group justify="space-between" wrap="wrap">
          <Button
            variant="default"
            onClick={() => {
              // Remove all unchecked permissions
              const toRemove = loadedPermissions.filter((perm) => !checkedPermissions.includes(perm));
              if (toRemove.length > 0) {
                // Remove only the first unchecked permission for demo, or loop for all
                removeOne();
              }
            }}
            loading={isSubmitting}
            disabled={!user || checkedPermissions.length === loadedPermissions.length}
          >
            Remove Unchecked Permissions
          </Button>
          <Group>
            <Button
              variant="default"
              onClick={replace}
              loading={isSubmitting}
              disabled={!user || checkedPermissions.length === 0}
            >
              Replace
            </Button>
            <Button
              onClick={assign}
              loading={isSubmitting}
              disabled={!user || !permissionsText.trim()}
            >
              Assign New
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
