"use client";

import { Badge, Box, Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useMirror } from "./store";

const UI = () => {
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");
  const rolesText = useMirror("rolesText");
  const setRolesText = useMirror("setRolesText");
  const currentRoles = useMirror("currentRoles");
  const isSubmitting = useMirror("isSubmitting");
  const assign = useMirror("assign");
  const remove = useMirror("remove");

  return (
    <Modal opened={isOpen} onClose={onClose} title="Manage Roles" centered>
      <Stack>
        <Text size="sm">User: {user?.fullName || "-"}</Text>

        {currentRoles && currentRoles.length > 0 && (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Current Roles:
            </Text>
            <Group gap="xs">
              {currentRoles.map((role) => (
                <Badge key={role} size="lg" variant="light" color="blue">
                  {role}
                </Badge>
              ))}
            </Group>
          </Box>
        )}

        <TextInput
          label="Roles to add/remove (comma separated)"
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
