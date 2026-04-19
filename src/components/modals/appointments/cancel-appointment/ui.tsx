"use client";

import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAlertTriangle, IconBan } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.appointments");
  const tc = useTranslations("admin.common");

  const isOpen = useMirror("isOpen");
  const appointment = useMirror("appointment");
  const isSubmitting = useMirror("isSubmitting");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="red">
            <IconBan size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("cancelTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("cancelSubtitle")}
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
        },
      }}
    >
      <Stack gap="lg">
        <Alert
          color="red"
          radius="lg"
          icon={<IconAlertTriangle size={18} />}
          title={t("cancelAlertTitle")}
        >
          <Text size="sm">
            {appointment
              ? t("cancelAlertBodyNamed").replace("{name}", appointment.name)
              : t("cancelAlertBody")}
          </Text>
        </Alert>

        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose} disabled={isSubmitting} radius="md">
            {tc("close")}
          </Button>
          <Button color="red" onClick={submit} loading={isSubmitting} radius="md">
            {t("cancelAppointment")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
