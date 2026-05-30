"use client";

import { useState } from "react";
import {
  ActionIcon,
  Button,
  Menu,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { FiBell, FiBellOff, FiCheck } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { usePushNotificationsContext } from "../context/push-notifications-context";
import navbarStyles from "@/components/shared/navbar/styles.module.scss";
import styles from "./notifications-menu.module.scss";

/**
 * Navbar bell control: opens a menu with push status and enable action.
 */
export function NotificationsMenu() {
  const t = useTranslations("pushNotifications");
  const { status, lastError, enablePush } = usePushNotificationsContext();
  const [opened, setOpened] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  const handleEnable = async () => {
    setIsEnabling(true);
    try {
      await enablePush();
    } finally {
      setIsEnabling(false);
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

  const StatusIcon =
    status === "registered"
      ? FiCheck
      : status === "denied" || status === "unsupported"
        ? FiBellOff
        : FiBell;

  return (
    <Menu
      shadow="md"
      width={320}
      position="bottom-end"
      offset={10}
      opened={opened}
      onChange={setOpened}
      classNames={{ dropdown: styles.dropdown }}
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          aria-label={t("menuAria")}
          className={`${navbarStyles.actionButton} ${styles.bellButton}`}
          data-active={status === "registered" ? "true" : "false"}
        >
          <FiBell size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Stack gap="sm" p="xs">
          <div className={styles.header}>
            <ThemeIcon variant="light" size="lg" radius="md" color="cyan">
              <StatusIcon size={16} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="sm">
                {t("menuTitle")}
              </Text>
              <Text size="xs" c="dimmed">
                {statusMessage}
              </Text>
            </div>
          </div>

          {lastError ? (
            <Text size="xs" c="red">
              {lastError}
            </Text>
          ) : null}

          {status === "not_configured" ? (
            <Text size="xs" c="dimmed">
              {t("vapidHint")}
            </Text>
          ) : null}

          {showEnableButton ? (
            <Button
              size="xs"
              fullWidth
              loading={isEnabling}
              onClick={() => void handleEnable()}
            >
              {t("enableButton")}
            </Button>
          ) : null}

          <Text size="xs" c="dimmed" className={styles.emptyHint}>
            {t("emptyList")}
          </Text>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
