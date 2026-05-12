"use client";

import { Badge, Box, Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.users");
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");
  const rolesText = useMirror("rolesText");
  const setRolesText = useMirror("setRolesText");
  const currentRoles = useMirror("currentRoles");
  const isSubmitting = useMirror("isSubmitting");
  const assign = useMirror("assign");
  const remove = useMirror("remove");

  const displayName = user?.fullName?.trim() && user.fullName.trim().length > 0 ? user.fullName.trim() : "-";

  return (
    <Modal opened={isOpen} onClose={onClose} title={t("rolesModalTitle")} centered>
      <Stack>
        <Text size="sm" dir="auto">
          {t("rolesModalUser", { name: displayName })}
        </Text>

        {currentRoles && currentRoles.length > 0 && (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              {t("rolesModalCurrentRoles")}
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
          label={t("rolesModalInputLabel")}
          value={rolesText}
          onChange={(event) => setRolesText(event.currentTarget.value)}
          placeholder={t("rolesModalPlaceholder")}
        />
        <Group justify="space-between">
          <Button
            variant="default"
            onClick={remove}
            loading={isSubmitting}
            disabled={!user || !rolesText.trim()}
          >
            {t("rolesModalRemove")}
          </Button>
          <Button onClick={assign} loading={isSubmitting} disabled={!user || !rolesText.trim()}>
            {t("rolesModalAssign")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
