"use client";

import { Link } from "@/i18n/navigation";
import { useQuickActionNavigate } from "@/hooks/use-quick-action-navigate";
import type { navbarQuickAction } from "./type";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  FiBell,
  FiChevronDown,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { useTranslations } from "next-intl";
import { navbarActionIcon, navbarProfileMenuItemId } from "./type";
import { QUICK_ACTION_ICONS } from "./icons";
import { CommandPalette } from "./command-palette";
import { useMirror } from "./store";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NotificationsMenu } from "@/features/push-notifications/ui/notifications-menu";
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

const subscribeNoop = () => () => undefined;
const getIsMacSnapshot = () => /Mac|iPhone|iPad/.test(window.navigator.platform);
const getServerIsMacSnapshot = () => false;

const UI = () => {
  const isMobileViewport = useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    getServerMobileViewportSnapshot,
  );
  const t = useTranslations() as (key: string) => string;
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
  const onLogout = useMirror("onLogout");
  const tPalette = useTranslations("commandPalette");
  const runQuickAction = useQuickActionNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isMac = useSyncExternalStore(
    subscribeNoop,
    getIsMacSnapshot,
    getServerIsMacSnapshot,
  );
  const quickActions = config.quickActions ?? [];
  const navItems = config.navItems ?? [];

  // Global shortcuts: Ctrl/⌘+K anywhere, or "/" when not typing in a field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if (typing) return;
      event.preventDefault();
      setPaletteOpen(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

  const navigateQuickAction = (action: navbarQuickAction) => runQuickAction(action);

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

          <UnstyledButton
            className={styles.searchTrigger}
            onClick={() => setPaletteOpen(true)}
            aria-label={tPalette("trigger")}
            aria-keyshortcuts="Control+K Meta+K"
          >
            <FiSearch size={16} aria-hidden className={styles.searchTriggerIcon} />
            <span className={styles.searchTriggerLabel}>{tPalette("trigger")}</span>
            <kbd className={styles.quickActionsButtonKbd} dir="ltr">
              {shortcutLabel}
            </kbd>
          </UnstyledButton>
        </Group>

        <Group gap="xs" wrap="nowrap">
          {quickActions.length > 0 && (
            <Menu shadow="lg" width={280} position="bottom-end" offset={10}>
              <Menu.Target>
                <UnstyledButton
                  className={styles.createButton}
                  aria-label={tPalette("create")}
                >
                  <FiPlus size={16} aria-hidden />
                  <span className={styles.createButtonLabel}>{tPalette("create")}</span>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{tPalette("actions")}</Menu.Label>
                {quickActions.map((action) => {
                  const Icon = QUICK_ACTION_ICONS[action.icon];
                  return (
                    <Menu.Item
                      key={action.id}
                      leftSection={
                        <span className={styles.quickActionsIconBadge}>
                          <Icon size={15} />
                        </span>
                      }
                      onClick={() => navigateQuickAction(action)}
                    >
                      <Text size="sm" fw={600} lh={1.3}>
                        {translate(`quickActions.${action.label}`, action.label)}
                      </Text>
                      <Text size="xs" c="dimmed" lh={1.3}>
                        {translate(`quickActions.${action.description}`, action.description)}
                      </Text>
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
          )}

          {config.actions.map((action) => {
            if (action.icon === "notification") {
              return <NotificationsMenu key={action.label} />;
            }

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
                <Group gap="xs" wrap="nowrap" >
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
      <CommandPalette
        opened={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        navItems={navItems}
        quickActions={quickActions}
        paletteLinks={config.paletteLinks}
      />
    </header>
  );
};

export default UI;
