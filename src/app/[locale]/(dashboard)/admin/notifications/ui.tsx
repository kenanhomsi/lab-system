"use client";

import { useState } from "react";
import {
  Button,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { isAxiosError } from "axios";
import { extractErrorMessage } from "@/lib/error";
import type { UserRole } from "@/types/user";
import { getNotificationsService } from "@/features/push-notifications/lib/notifications-api";

type TargetMode = "role" | "user";

const ROLE_OPTIONS: UserRole[] = [
  "patient",
  "doctor",
  "LabPartner",
  "special",
  "admin",
];

export default function AdminNotificationsUI() {
  const t = useTranslations("adminNotifications");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetMode, setTargetMode] = useState<TargetMode>("role");
  const [targetRole, setTargetRole] = useState<UserRole>("patient");
  const [targetUserId, setTargetUserId] = useState("");
  const [dataKey, setDataKey] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      notifications.show({
        color: "red",
        title: t("errorTitle"),
        message: t("requiredFields"),
      });
      return;
    }

    if (targetMode === "role" && !targetRole) {
      notifications.show({
        color: "red",
        title: t("errorTitle"),
        message: t("roleRequired"),
      });
      return;
    }

    if (targetMode === "user" && !targetUserId.trim()) {
      notifications.show({
        color: "red",
        title: t("errorTitle"),
        message: t("userRequired"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await getNotificationsService().sendNotification({
        title: trimmedTitle,
        body: trimmedBody,
        ...(targetMode === "role"
          ? { targetRole }
          : { targetUserId: targetUserId.trim() }),
        ...(dataKey.trim() && dataValue.trim()
          ? { data: { [dataKey.trim()]: dataValue.trim() } }
          : {}),
      });

      notifications.show({
        color: "green",
        title: t("successTitle"),
        message: t("successMessage"),
      });

      setTitle("");
      setBody("");
      setTargetUserId("");
      setDataKey("");
      setDataValue("");
    } catch (error: unknown) {
      const message = extractErrorMessage(error, t("sendFailed"));
      const status = isAxiosError(error) ? error.response?.status : undefined;
      notifications.show({
        color: "red",
        title: t("errorTitle"),
        message: status ? `${message} (${status})` : message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap="lg" p={{ base: "sm", md: "md" }}>
      <div>
        <Title order={2}>{t("title")}</Title>
        <Text c="dimmed" size="sm">
          {t("subtitle")}
        </Text>
      </div>

      <Paper withBorder radius="md" p="md">
        <Stack gap="md">
          <TextInput
            label={t("titleLabel")}
            placeholder={t("titlePlaceholder")}
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            required
          />

          <Textarea
            label={t("bodyLabel")}
            placeholder={t("bodyPlaceholder")}
            value={body}
            onChange={(event) => setBody(event.currentTarget.value)}
            minRows={4}
            required
          />

          <div>
            <Text size="sm" fw={500} mb={6}>
              {t("targetModeLabel")}
            </Text>
            <SegmentedControl
              value={targetMode}
              onChange={(value) => setTargetMode(value as TargetMode)}
              data={[
                { label: t("targetModeRole"), value: "role" },
                { label: t("targetModeUser"), value: "user" },
              ]}
            />
          </div>

          {targetMode === "role" ? (
            <Select
              label={t("targetRoleLabel")}
              value={targetRole}
              onChange={(value) => setTargetRole((value as UserRole) ?? "patient")}
              data={ROLE_OPTIONS.map((role) => ({
                value: role,
                label: t(`roles.${role}`),
              }))}
              required
            />
          ) : (
            <TextInput
              label={t("targetUserIdLabel")}
              placeholder={t("targetUserIdPlaceholder")}
              value={targetUserId}
              onChange={(event) => setTargetUserId(event.currentTarget.value)}
              required
            />
          )}

          <Group grow align="flex-end">
            <TextInput
              label={t("dataKeyLabel")}
              placeholder={t("dataKeyPlaceholder")}
              value={dataKey}
              onChange={(event) => setDataKey(event.currentTarget.value)}
            />
            <TextInput
              label={t("dataValueLabel")}
              placeholder={t("dataValuePlaceholder")}
              value={dataValue}
              onChange={(event) => setDataValue(event.currentTarget.value)}
            />
          </Group>

          <Group justify="flex-end">
            <Button loading={isSubmitting} onClick={() => void handleSubmit()}>
              {t("sendButton")}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
