"use client";

import { Stack, Title, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { NotificationsPanel } from "@/features/push-notifications/ui/notifications-panel";

export default function NotificationsPageUI() {
  const t = useTranslations("notificationsPage");

  return (
    <Stack gap="lg" p={{ base: "sm", md: "md" }}>
      <div>
        <Title order={2}>{t("title")}</Title>
        <Text c="dimmed" size="sm">
          {t("subtitle")}
        </Text>
      </div>
      <NotificationsPanel showHeader={false} />
    </Stack>
  );
}
