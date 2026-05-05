"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ActionIcon, Avatar, Group, Menu, Text, TextInput, UnstyledButton } from "@mantine/core";
import {
  FiBell,
  FiChevronDown,
  FiHelpCircle,
  FiMenu,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { useTranslations, useLocale } from "next-intl";
import { navbarActionIcon, navbarProfileMenuItemId } from "./type";
import { useMirror } from "./store";
import { LocaleSwitcher } from "@/components/locale-switcher";
import styles from "./styles.module.scss";

const actionIconMap: Record<navbarActionIcon, IconType> = {
  notification: FiBell,
  help: FiHelpCircle,
};

const profileMenuIconMap: Record<navbarProfileMenuItemId, IconType> = {
  profile: FiUser,
  settings: FiSettings,
  logout: FiLogOut,
};

const mobileViewportQuery = "(max-width: 992px)";

const subscribeToMobileViewport = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(mobileViewportQuery);

  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
};

const getMobileViewportSnapshot = () => window.matchMedia(mobileViewportQuery).matches;
const getServerMobileViewportSnapshot = () => false;

const UI = () => {
  const isMobileViewport = useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    getServerMobileViewportSnapshot,
  );
  const t = useTranslations() as (key: string) => string;
  const locale = useLocale();
  const rtl = locale === "ar";
  const translate = (key: string, fallback?: string) => {
    try {
      return t(`navbar.${key}`);
    } catch {
      return fallback ?? key;
    }
  };

  // Ensure all required keys are present in the translation file
  const requiredKeys = [
    "searchPlaceholder",
    "notifications",
    "help",
    "profile",
    "settings",
    "logout",
    "lightMode",
    "darkMode",
  ];

  requiredKeys.forEach((key) => {
    if (!translate(key)) {
      console.error(`Missing translation key: navbar.${key}`);
    }
  });

  const config = useMirror("config");
  const searchQuery = useMirror("searchQuery");
  const setSearchQuery = useMirror("setSearchQuery");
  const onLogout = useMirror("onLogout");

  return (
    <header className={styles.navbar}>
      <Group justify="space-between" className={styles.content} wrap="nowrap">
        <Group wrap="nowrap" gap="sm" className={styles.leftActions}>
          {isMobileViewport && (
            <ActionIcon
              variant="subtle"
              aria-label="Toggle sidebar navigation"
              className={styles.mobileMenuButton}
              onClick={() => window.dispatchEvent(new Event("dashboard:toggle-sidebar"))}
            >
              <FiMenu size={17} />
            </ActionIcon>
          )}

          <TextInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            placeholder={translate(
              config.searchPlaceholder || "searchPlaceholder",
              translate("searchPlaceholder", "Search..."),
            )}
            className={styles.searchInput}
            leftSection={!rtl ? <FiSearch size={16} /> : undefined}
            rightSection={rtl ? <FiSearch size={16} /> : undefined}
            aria-label={translate("searchPlaceholder", "Search")}
          />
        </Group>

        <Group gap="xs" wrap="nowrap">
          {config.actions.map((action) => {
            const Icon = actionIconMap[action.icon];
            if (action.href) {
              return (
                <ActionIcon
                  key={action.label}
                  component={Link}
                  href={action.href}
                  variant="subtle"
                  aria-label={translate(action.label, action.label)}
                  className={styles.actionButton}
                >
                  <Icon size={18} />
                </ActionIcon>
              );
            }

            return (
              <ActionIcon
                key={action.label}
                variant="subtle"
                aria-label={translate(action.label, action.label)}
                className={styles.actionButton}
              >
                <Icon size={18} />
              </ActionIcon>
            );
          })}

          <LocaleSwitcher />

          <Menu
            withArrow
            shadow="md"
            width={190}
            position="bottom-end"
            offset={10}
          >
            <Menu.Target>
              <UnstyledButton
                className={styles.profileButton}
                aria-label="Open profile menu"
              >
                <Group gap="xs" wrap="nowrap" className={styles.profile}>
                  <Avatar
                    src={config.profile.avatarSrc}
                    radius="xl"
                    size={38}
                    color="cyan"
                  >
                    {config.profile.avatarFallback ?? config.profile.name.slice(0, 2)}
                  </Avatar>

                  <div className={styles.profileText}>
                    <Text className={styles.name}>{config.profile.name}</Text>
                    <Text className={styles.role}>{config.profile.roleTitle}</Text>
                  </div>

                  <FiChevronDown size={16} className={styles.chevron} />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              {config.profileMenu.map((item) => {
                const Icon = profileMenuIconMap[item.id];
                const isLogout = item.id === "logout";

                if (item.href) {
                  return (
                    <Menu.Item
                      key={item.id}
                      component={Link}
                      href={item.href}
                      leftSection={<Icon size={15} />}
                      color={isLogout ? "red" : undefined}
                    >
                      {translate(item.label, item.label)}
                    </Menu.Item>
                  );
                }

                return (
                  <Menu.Item
                    key={item.id}
                    leftSection={<Icon size={15} />}
                    color={isLogout ? "red" : undefined}
                    onClick={isLogout ? onLogout : undefined}
                  >
                    {translate(item.label, item.label)}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </header>
  );
};

export default UI;
