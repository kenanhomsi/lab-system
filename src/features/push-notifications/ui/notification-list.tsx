"use client";

import { Loader, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { FiBell } from "react-icons/fi";
import { useTranslations } from "next-intl";
import type { UserNotification } from "@/modules/notifications";
import { formatNotificationDate } from "../lib/format-notification-date";
import styles from "./notification-list.module.scss";

type NotificationListProps = {
  items: UserNotification[];
  compact?: boolean;
  markingIds?: Set<number>;
  onMarkAsRead?: (id: number) => void | Promise<void>;
};

/**
 * Renders a scrollable list of user notifications with read/unread styling.
 */
export function NotificationList({
  items,
  compact = false,
  markingIds,
  onMarkAsRead,
}: NotificationListProps) {
  const t = useTranslations("pushNotifications");

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <ThemeIcon variant="light" size={compact ? "lg" : "xl"} radius="xl" color="gray">
          <FiBell size={compact ? 18 : 22} />
        </ThemeIcon>
        <Text size="sm" fw={500} className={styles.emptyTitle}>
          {t("noNotifications")}
        </Text>
      </div>
    );
  }

  return (
    <Stack gap={compact ? 6 : "sm"} className={styles.list}>
      {items.map((item) => {
        const title = item.title?.trim() || t("defaultTitle");
        const body = item.body?.trim() || t("defaultBody");
        const createdAt = formatNotificationDate(item.createdAt);
        const isUnread = item.isRead === false;
        const isMarking = markingIds?.has(item.id) ?? false;
        const canMarkRead = isUnread && Boolean(onMarkAsRead);

        const content = (
          <>
            <ThemeIcon
              variant="light"
              size={compact ? "md" : "lg"}
              radius="md"
              color={isUnread ? "cyan" : "gray"}
              className={styles.itemIcon}
            >
              <FiBell size={compact ? 14 : 16} />
            </ThemeIcon>

            <div className={styles.itemContent}>
              <div className={styles.itemTitleRow}>
                {isUnread ? <span className={styles.unreadDot} aria-hidden /> : null}
                <Text
                  size={compact ? "xs" : "sm"}
                  fw={isUnread ? 700 : 500}
                  lineClamp={compact ? 1 : 2}
                  className={styles.itemTitle}
                >
                  {title}
                </Text>
                {isMarking ? (
                  <Loader size={14} color="cyan" className={styles.itemLoader} />
                ) : null}
              </div>

              <Text size="xs" c="dimmed" lineClamp={compact ? 2 : 3} className={styles.itemBody}>
                {body}
              </Text>

              {createdAt ? (
                <Text size="xs" c="dimmed" className={styles.time}>
                  {createdAt}
                </Text>
              ) : null}
            </div>
          </>
        );

        if (canMarkRead) {
          return (
            <UnstyledButton
              key={item.id}
              type="button"
              className={styles.item}
              data-read="false"
              data-compact={compact ? "true" : "false"}
              data-clickable="true"
              disabled={isMarking}
              aria-label={t("markAsReadAria", { title })}
              onClick={() => void onMarkAsRead?.(item.id)}
            >
              {content}
            </UnstyledButton>
          );
        }

        return (
          <article
            key={item.id}
            className={styles.item}
            data-read={item.isRead ? "true" : "false"}
            data-compact={compact ? "true" : "false"}
          >
            {content}
          </article>
        );
      })}
    </Stack>
  );
}
