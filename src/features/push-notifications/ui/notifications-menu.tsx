"use client";

import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Indicator,
  Loader,
  Menu,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { FiBell, FiBellOff, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePushNotificationsContext } from "../context/push-notifications-context";
import { useNotificationsList } from "../hooks/use-notifications-list";
import { NotificationList } from "./notification-list";
import navbarStyles from "@/components/shared/navbar/styles.module.scss";
import styles from "./notifications-menu.module.scss";

const DROPDOWN_PREVIEW_COUNT = 5;

type PushStatus = ReturnType<typeof usePushNotificationsContext>["status"];

function getStatusMeta(status: PushStatus) {
  switch (status) {
    case "registered":
      return { icon: FiCheck, color: "teal" as const, tone: "success" as const };
    case "denied":
      return { icon: FiBellOff, color: "red" as const, tone: "danger" as const };
    case "unsupported":
    case "not_configured":
      return { icon: FiBellOff, color: "gray" as const, tone: "muted" as const };
    case "loading":
    case "registering":
      return { icon: FiBell, color: "blue" as const, tone: "info" as const };
    default:
      return { icon: FiBell, color: "orange" as const, tone: "warning" as const };
  }
}

/**
 * Navbar bell control: push status, notification history, and enable action.
 */
export function NotificationsMenu() {
  const t = useTranslations("pushNotifications");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { status, lastError, enablePush } = usePushNotificationsContext();
  const [opened, setOpened] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const { data, isLoading, error, unreadCount, markingIds, isMarkingAll, refresh, markAsRead, markAllAsRead } =
    useNotificationsList({
    page: 1,
    pageSize: 10,
    enabled: true,
  });

  const previewItems = (data?.items ?? []).slice(0, DROPDOWN_PREVIEW_COUNT);
  const statusMeta = getStatusMeta(status);
  const StatusIcon = statusMeta.icon;
  const ViewAllChevron = isRtl ? FiChevronLeft : FiChevronRight;

  const handleEnable = async () => {
    setIsEnabling(true);
    try {
      await enablePush();
    } finally {
      setIsEnabling(false);
    }
  };

  const handleOpenChange = (nextOpened: boolean) => {
    setOpened(nextOpened);
    if (nextOpened) {
      void refresh();
    }
  };

  const showEnableButton =
    status === "default" ||
    status === "denied" ||
    status === "not_configured";

  const statusMessage = (() => {
    switch (status) {
      case "loading":
        return t("statusLoading");
      case "not_configured":
        return t("statusNotConfigured");
      case "unsupported":
        return t("statusUnsupported");
      case "denied":
        return t("statusDenied");
      case "registering":
        return t("statusRegistering");
      case "registered":
        return t("statusRegistered");
      default:
        return t("statusDefault");
    }
  })();

  return (
    <Menu
      shadow="lg"
      width={380}
      position="bottom-end"
      offset={12}
      opened={opened}
      onChange={handleOpenChange}
      classNames={{ dropdown: styles.dropdown }}
    >
      <Menu.Target>
        <Indicator
          inline
          disabled={unreadCount === 0}
          label={unreadCount > 9 ? "9+" : unreadCount}
          size={18}
          color="red"
          offset={5}
          processing={unreadCount > 0}
        >
          <ActionIcon
            variant="subtle"
            aria-label={t("menuAria")}
            className={`${navbarStyles.actionButton} ${styles.bellButton}`}
            data-active={status === "registered" ? "true" : "false"}
            data-has-unread={unreadCount > 0 ? "true" : "false"}
          >
            <FiBell size={18} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerTitleGroup}>
              <ThemeIcon variant="light" size="lg" radius="md" color="cyan">
                <FiBell size={16} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="sm" lh={1.2}>
                  {t("menuTitle")}
                </Text>
                {unreadCount > 0 ? (
                  <Badge size="xs" variant="light" color="red" mt={4}>
                    {t("unreadBadge", { count: unreadCount })}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          <div className={styles.statusBanner} data-tone={statusMeta.tone}>
            <ThemeIcon variant="light" size="sm" radius="xl" color={statusMeta.color}>
              <StatusIcon size={14} />
            </ThemeIcon>
            <Text size="xs" className={styles.statusText}>
              {statusMessage}
            </Text>
          </div>

          {lastError ? (
            <Text size="xs" c="red" className={styles.inlineMessage}>
              {lastError}
            </Text>
          ) : null}

          {status === "not_configured" ? (
            <Text size="xs" c="dimmed" className={styles.inlineMessage}>
              {t("vapidHint")}
            </Text>
          ) : null}

          {showEnableButton ? (
            <Button
              size="xs"
              fullWidth
              variant="light"
              color="cyan"
              loading={isEnabling}
              leftSection={<FiBell size={14} />}
              onClick={() => void handleEnable()}
              className={styles.enableButton}
            >
              {t("enableButton")}
            </Button>
          ) : null}
        </div>

        <Divider className={styles.sectionDivider} />

        <div className={styles.historySection}>
          <div className={styles.sectionHeaderRow}>
            <Text size="xs" fw={700} tt="uppercase" className={styles.sectionLabel}>
              {t("recentTitle")}
            </Text>
            {unreadCount > 0 ? (
              <Button
                variant="subtle"
                size="compact-xs"
                color="cyan"
                loading={isMarkingAll}
                className={styles.markAllButton}
                onClick={() => void markAllAsRead()}
              >
                {t("markAllRead")}
              </Button>
            ) : null}
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <Loader size="sm" color="cyan" />
            </div>
          ) : error ? (
            <Text size="xs" c="red" className={styles.errorMessage}>
              {error}
            </Text>
          ) : (
            <NotificationList
              items={previewItems}
              compact
              markingIds={markingIds}
              onMarkAsRead={markAsRead}
            />
          )}
        </div>

        <div className={styles.footer}>
          <UnstyledButton
            component={Link}
            href="/notifications"
            className={styles.viewAllButton}
            onClick={() => setOpened(false)}
          >
            <span>{t("viewAll")}</span>
            <ViewAllChevron size={16} className={styles.viewAllIcon} />
          </UnstyledButton>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
}
