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
import { IconTag, IconUsersGroup } from "@tabler/icons-react";
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
  const t = useTranslations("admin.settings.roles");
  const isOpen = useMirror("isOpen");
  const role = useMirror("role");
  const name = useMirror("name");
  const setName = useMirror("setName");
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
            <IconUsersGroup size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>
              {role ? t("modalEditTitle") : t("modalCreateTitle")}
            </Title>
            <Text size="sm" c="dimmed">
              {role
                ? "Update the name of this role."
                : "Create a new role to group related permissions together."}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size="md"
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
            {role ? "Edit role" : "New role"}
          </Badge>
          <Text size="sm" c="dimmed">
            Required: name
          </Text>
        </Group>

        <Paper withBorder radius="lg" p="md">
          <Stack gap="md">
            <SectionHeader
              icon={<IconUsersGroup size={18} />}
              title="Role Details"
              description="Enter a unique name that clearly identifies this role in the system."
            />
            <TextInput
              label={t("nameLabel")}
              placeholder="e.g. admin, doctor, nurse"
              leftSection={<IconTag size={16} />}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />
          </Stack>
        </Paper>

        <Paper withBorder radius="lg" p="md">
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text fw={600}>
                {role ? "Ready to save changes?" : "Ready to create this role?"}
              </Text>
              <Text size="sm" c="dimmed">
                {role ? "Review the name, then save." : "Review the details, then create."}
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
