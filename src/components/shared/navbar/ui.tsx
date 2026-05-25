"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { buildQuickActionHref } from "@/lib/quick-actions/build-href";
import { writePendingQuickAction } from "@/lib/quick-actions/storage";
import type { navbarQuickAction } from "./type";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  FiActivity,
  FiAlertCircle,
  FiBell,
  FiCheckCircle,
  FiClipboard,
  FiCreditCard,
  FiHelpCircle,
  FiMenu,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
  FiUserPlus,
  FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { useTranslations, useLocale } from "next-intl";
import {
  navbarActionIcon,
  navbarProfileMenuItemId,
  navbarQuickActionIcon,
} from "./type";
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

const quickActionIconMap: Record<navbarQuickActionIcon, IconType> = {
  userPlus: FiUserPlus,
  flask: FiActivity,
  clipboardList: FiClipboard,
  clipboardCheck: FiCheckCircle,
  creditCard: FiCreditCard,
  alertCircle: FiAlertCircle,
  shield: FiShield,
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

  const router = useRouter();
  const config = useMirror("config");
  const searchQuery = useMirror("searchQuery");
  const setSearchQuery = useMirror("setSearchQuery");
  const onLogout = useMirror("onLogout");
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [quickActionQuery, setQuickActionQuery] = useState("");
  const quickActions = config.quickActions ?? [];

  const handleQuickActionsOpenChange = (opened: boolean) => {
    setQuickActionsOpen(opened);

    if (!opened) {
      setQuickActionQuery("");
    }
  };

  const navigateQuickAction = (action: navbarQuickAction) => {
    setQuickActionsOpen(false);
    setQuickActionQuery("");

    if (action.modal) {
      writePendingQuickAction({
        modal: action.modal,
        tab: action.tab,
        targetPath: action.href,
      });
    }

    const target = buildQuickActionHref(action.href, {
      modal: action.modal,
      tab: action.tab,
    });

    router.push(target);
  };

  useEffect(() => {
    if (!quickActionsOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [quickActionsOpen]);

  const normalizedQuickActionQuery = quickActionQuery
    .trim()
    .toLocaleLowerCase(locale);
  const filteredQuickActions = quickActions.filter((action) => {
    if (!normalizedQuickActionQuery) {
      return true;
    }

    const label = translate(`quickActions.${action.label}`, action.label);
    const description = translate(
      `quickActions.${action.description}`,
      action.description,
    );

    return `${label} ${description}`
      .toLocaleLowerCase(locale)
      .includes(normalizedQuickActionQuery);
  });

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
          {quickActions.length > 0 && (
            <Menu
              shadow="xl"
              width={560}
              position="bottom-end"
              offset={10}
              opened={quickActionsOpen}
              onChange={handleQuickActionsOpenChange}
              classNames={{ dropdown: styles.quickActionsDropdown }}
              keepMounted={false}
            >
              <Menu.Target>
                <UnstyledButton
                  className={styles.quickActionsButton}
                  data-expanded={quickActionsOpen ? "true" : "false"}
                  aria-label={translate("quickActions.title", "Quick Actions")}
                >
                  <FiSearch size={15} className={styles.quickActionsButtonSearchIcon} />
                  <span className={styles.quickActionsButtonLabel}>
                    {translate("quickActions.title", "Quick Actions")}
                  </span>
                  <kbd className={styles.quickActionsButtonKbd} dir="ltr">⌘K</kbd>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <div className={styles.quickActionsCommandBar}>
                  <TextInput
                    value={quickActionQuery}
                    onChange={(event) => setQuickActionQuery(event.currentTarget.value)}
                    placeholder={translate(
                      "quickActions.searchPlaceholder",
                      "Type a command or search",
                    )}
                    className={styles.quickActionsCommandSearch}
                    leftSection={<FiSearch size={17} />}
                    rightSection={<kbd className={styles.quickActionsSearchKbd} dir="ltr">⌘/</kbd>}
                    aria-label={translate("quickActions.searchPlaceholder", "Search actions")}
                    autoFocus
                  />
                </div>

                <Text className={styles.quickActionsSectionLabel}>
                  {translate("quickActions.recent", "Recent")}
                </Text>

                <div className={styles.quickActionsList}>
                  {filteredQuickActions.map((action, index) => {
                    const Icon = quickActionIconMap[action.icon];

                    return (
                      <Menu.Item
                        key={action.id}
                        className={styles.quickActionsMenuItem}
                        onClick={() => navigateQuickAction(action)}
                      >
                        <div className="W-full flex items-center justify-between">
                          <span className={styles.quickActionsIconBadge}>
                            <Icon size={16} />
                          </span>

                          <span className={styles.quickActionsItemLabel}>
                            {translate(`quickActions.${action.label}`, action.label)}
                          </span>

                          <kbd className={styles.quickActionsShortcut} dir="ltr">
                            ⌘{index + 1}
                          </kbd>
                        </div>
                      </Menu.Item>
                    );
                  })}

                  {quickActions.length > 0 && filteredQuickActions.length === 0 && (
                    <Text className={styles.quickActionsEmpty}>
                      {translate("quickActions.empty", "No actions found")}
                    </Text>
                  )}
                </div>
              </Menu.Dropdown>
            </Menu>
          )}

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
    </header>
  );
};

export default UI;
