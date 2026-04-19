"use client";

import {
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlignLeft,
  IconShieldLock,
  IconTag,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const SectionHeader = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <Group align="flex-start" gap="sm">
    <ThemeIcon size={38} radius="md" variant="light" color="blue">
      {icon}
    </ThemeIcon>
    <Stack gap={2}>
      <Text fw={600}>{title}</Text>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Stack>
  </Group>
);

const UI = () => {
  const t = useTranslations("admin.settings.permissions");
  const isOpen = useMirror("isOpen");
  const permission = useMirror("permission");
  const name = useMirror("name");
  const setName = useMirror("setName");
  const description = useMirror("description");
  const setDescription = useMirror("setDescription");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconShieldLock size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>
              {permission ? t("modalEditTitle") : t("modalCreateTitle")}
            </Title>
            <Text size="sm" c="dimmed">
              {permission
                ? "Update the description for this permission."
                : "Define a new permission with a unique name and description."}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size="lg"
      radius="xl"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
      styles={{
        content: {
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "light-dark(rgba(255,255,255,0.82), rgba(18,18,23,0.78))",
          border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        body: { scrollbarWidth: "none", msOverflowStyle: "none" },
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Badge variant="light" color="blue" radius="sm">
            {permission ? "Edit permission" : "New permission"}
          </Badge>
          <Text size="sm" c="dimmed">
            {permission ? "Required: description" : "Required: name, description"}
          </Text>
        </Group>

        <Paper withBorder radius="lg" p="md">
          <Stack gap="md">
            <SectionHeader
              icon={<IconShieldLock size={18} />}
              title="Permission Details"
              description="Set a unique identifier name and a clear description of what this permission grants."
            />
            {!permission && (
              <TextInput
                label={t("nameLabel")}
                placeholder="e.g. manage_users"
                leftSection={<IconTag size={16} />}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
              />
            )}
            <TextInput
              label={t("descriptionLabel")}
              placeholder="e.g. Allows managing all user accounts"
              leftSection={<IconAlignLeft size={16} />}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              required
            />
          </Stack>
        </Paper>

        <Paper withBorder radius="lg" p="md">
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text fw={600}>
                {permission ? "Ready to save changes?" : "Ready to create this permission?"}
              </Text>
              <Text size="sm" c="dimmed">
                {permission
                  ? "Review the description, then save."
                  : "Review the details, then create."}
              </Text>
            </Stack>
            <Group justify="flex-end">
              <Button variant="default" onClick={handleClose} disabled={isSubmitting}>
                {t("cancel")}
              </Button>
              <Button onClick={submit} loading={isSubmitting} disabled={!canSubmit} radius="md">
                {t("save")}
              </Button>
            </Group>
          </Group>
        </Paper>
      </Stack>
    </Modal>
  );
};

export { UI };
