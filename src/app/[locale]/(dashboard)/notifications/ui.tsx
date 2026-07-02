"use client";

import { useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { NotificationList } from "@/features/push-notifications/ui/notification-list";
import { useNotificationsList } from "@/features/push-notifications/hooks/use-notifications-list";

const PAGE_SIZE = 20;

export default function NotificationsPageUI() {
  const t = useTranslations("notificationsPage");
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    error,
    unreadCount,
    markingIds,
    isMarkingAll,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotificationsList({
    page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const totalPages = data?.totalPages ?? 1;
  const hasPreviousPage = data?.hasPreviousPage ?? page > 1;
  const hasNextPage = data?.hasNextPage ?? page < totalPages;

  return (
    <Stack gap="lg" p={{ base: "sm", md: "md" }}>
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>{t("title")}</Title>
          <Text c="dimmed" size="sm">
            {t("subtitle")}
          </Text>
        </div>
        {unreadCount > 0 ? (
          <Button
            variant="light"
            color="cyan"
            loading={isMarkingAll}
            onClick={() => void markAllAsRead()}
          >
            {t("markAllRead")}
          </Button>
        ) : null}
      </Group>

      <Paper withBorder radius="md" p="md">
        {isLoading ? (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        ) : error ? (
          <Stack gap="sm" align="center" py="xl">
            <Text c="red" size="sm">
              {error}
            </Text>
            <Button variant="light" onClick={() => void refresh()}>
              {t("retry")}
            </Button>
          </Stack>
        ) : (
          <NotificationList
            items={data?.items ?? []}
            markingIds={markingIds}
            onMarkAsRead={markAsRead}
          />
        )}
      </Paper>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {t("pageInfo", {
            page: data?.page ?? page,
            totalPages: Math.max(totalPages, 1),
            totalCount: data?.totalCount ?? 0,
          })}
        </Text>
        <Group gap="sm">
          <Button
            variant="default"
            disabled={!hasPreviousPage || isLoading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            {t("previous")}
          </Button>
          <Button
            variant="default"
            disabled={!hasNextPage || isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            {t("next")}
          </Button>
        </Group>
      </Group>
    </Stack>
  );
}
