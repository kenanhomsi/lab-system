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
  <Group align="flex-start" gap="sm">
    <ThemeIcon size={38} radius="md" variant="light" color="teal">
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
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="teal">
            <IconCalendarEvent size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>
              {appointmentType ? t("modalEditTitle") : t("modalCreateTitle")}
            </Title>
            <Text size="sm" c="dimmed">
              {appointmentType
                ? "Update the appointment type name or toggle its active status."
                : "Define a new type of appointment available for booking."}
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
          <Badge variant="light" color="teal" radius="sm">
            {appointmentType ? "Edit appointment type" : "New appointment type"}
          </Badge>
          <Text size="sm" c="dimmed">
            Required: name
          </Text>
        </Group>

        <Paper withBorder radius="lg" p="md">
          <Stack gap="md">
            <SectionHeader
              icon={<IconCalendarEvent size={18} />}
              title="Appointment Type Details"
              description="Provide a clear name that patients and staff will see when booking appointments."
            />
            <TextInput
              label={t("nameLabel")}
              placeholder="e.g. General Consultation, Follow-up"
              leftSection={<IconTag size={16} />}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />
            {appointmentType && (
              <Group gap="sm" align="center">
                <IconToggleRight size={16} color="var(--mantine-color-teal-6)" />
                <Checkbox
                  label={t("activeLabel")}
                  checked={isActive}
                  onChange={(e) => setIsActive(e.currentTarget.checked)}
                />
              </Group>
            )}
          </Stack>
        </Paper>

        <Paper withBorder radius="lg" p="md">
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text fw={600}>
                {appointmentType ? "Ready to save changes?" : "Ready to create this type?"}
              </Text>
              <Text size="sm" c="dimmed">
                {appointmentType
                  ? "Review the details, then save."
                  : "Review the name, then create."}
              </Text>
            </Stack>
            <Group justify="flex-end">
              <Button variant="default" onClick={handleClose} disabled={isSubmitting}>
                {t("cancel")}
              </Button>
              <Button
                onClick={submit}
                loading={isSubmitting}
                disabled={!canSubmit}
                radius="md"
                color="teal"
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
