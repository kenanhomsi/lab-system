"use client";

import {
  Badge,
  Button,
  Checkbox,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCalendarEvent, IconTag, IconToggleRight } from "@tabler/icons-react";
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
  <Group align="flex-start" gap="sm" wrap="nowrap">
    <ThemeIcon size={44} radius="lg" variant="light" color="teal">
      {icon}
    </ThemeIcon>
    <Stack gap={4} style={{ flex: 1 }}>
      <Text fw={700} size="lg">
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.55}>
        {description}
      </Text>
    </Stack>
  </Group>
);

const UI = () => {
  const t = useTranslations("admin.settings.appointmentTypes");
  const isOpen = useMirror("isOpen");
  const appointmentType = useMirror("appointmentType");
  const name = useMirror("name");
  const setName = useMirror("setName");
  const isActive = useMirror("isActive");
  const setIsActive = useMirror("setIsActive");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
          <ThemeIcon size={46} radius="lg" variant="light" color="teal">
            <IconCalendarEvent size={22} />
          </ThemeIcon>
          <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
            <Title order={4} lh={1.2}>
              {appointmentType ? t("modalEditTitle") : t("modalCreateTitle")}
            </Title>
            <Text size="sm" c="dimmed" lh={1.45}>
              {appointmentType ? t("modalEditDescription") : t("modalCreateDescription")}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size="lg"
      radius="xl"
      padding={0}
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={{ blur: 12, backgroundOpacity: 0.24 }}
      styles={{
        content: {
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "light-dark(rgba(255,255,255,0.94), rgba(18,18,23,0.9))",
          border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.24)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        header: {
          background: "transparent",
          borderBottom: "1px solid light-dark(rgba(15,23,42,0.06), rgba(255,255,255,0.07))",
          padding: "var(--mantine-spacing-lg)",
          paddingBottom: "var(--mantine-spacing-md)",
        },
        title: { flex: 1 },
        body: {
          padding: "var(--mantine-spacing-lg)",
          paddingTop: "var(--mantine-spacing-md)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
    >
      <Stack gap="lg">
        <Group
          justify="space-between"
          align="center"
          gap="sm"
          wrap="wrap"
          p="sm"
          style={{
            borderRadius: "var(--mantine-radius-lg)",
            background: "light-dark(rgba(20,184,166,0.08), rgba(45,212,191,0.08))",
          }}
        >
          <Badge variant="light" color="teal" radius="sm">
            {appointmentType ? t("editBadge") : t("newBadge")}
          </Badge>
          <Text size="sm" c="dimmed">
            {t("requiredName")}
          </Text>
        </Group>

        <Paper withBorder radius="xl" p="lg" bg="light-dark(rgba(255,255,255,0.78), rgba(255,255,255,0.03))">
          <Stack gap="lg">
            <SectionHeader
              icon={<IconCalendarEvent size={18} />}
              title={t("detailsTitle")}
              description={t("detailsDescription")}
            />
            <TextInput
              label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              leftSection={<IconTag size={16} />}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              size="md"
              radius="md"
              required
            />
            {appointmentType && (
              <Group
                gap="sm"
                align="center"
                p="sm"
                style={{
                  borderRadius: "var(--mantine-radius-md)",
                  background: "light-dark(rgba(20,184,166,0.08), rgba(45,212,191,0.08))",
                }}
              >
                <IconToggleRight size={18} color="var(--mantine-color-teal-6)" />
                <Checkbox
                  label={t("activeLabel")}
                  checked={isActive}
                  onChange={(e) => setIsActive(e.currentTarget.checked)}
                  color="teal"
                />
              </Group>
            )}
          </Stack>
        </Paper>

        <Paper withBorder radius="xl" p="md" bg="light-dark(rgba(255,255,255,0.66), rgba(255,255,255,0.025))">
          <Group justify="space-between" align="center" gap="md" wrap="wrap">
            <Stack gap={2}>
              <Text fw={600}>
                {appointmentType ? t("editReadyTitle") : t("createReadyTitle")}
              </Text>
              <Text size="sm" c="dimmed">
                {appointmentType ? t("editReadyDescription") : t("createReadyDescription")}
              </Text>
            </Stack>
            <Group justify="flex-end" gap="sm" wrap="nowrap" style={{ flex: 1 }}>
              <Button variant="default" onClick={handleClose} disabled={isSubmitting} radius="md">
                {t("cancel")}
              </Button>
              <Button
                onClick={submit}
                loading={isSubmitting}
                disabled={!canSubmit}
                radius="md"
                color="teal"
                px="xl"
              >
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
