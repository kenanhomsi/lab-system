"use client";

import Link from "next/link";
import { ActionIcon, Avatar, Group, Menu, Text, TextInput, UnstyledButton } from "@mantine/core";
import {
  FiBell,
  FiChevronDown,
  FiHelpCircle,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { useTranslations } from "next-intl";
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

const UI = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("navbar") as (key: string) => string;

  const config = useMirror("config");
  const searchQuery = useMirror("searchQuery");
  const setSearchQuery = useMirror("setSearchQuery");
  const onLogout = useMirror("onLogout");

  return (
    <header className={styles.navbar}>
      <Group justify="space-between" className={styles.content} wrap="nowrap">
        <TextInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          placeholder={t(config.searchPlaceholder)}
          className={styles.searchInput}
          leftSection={<FiSearch size={16} />}
          aria-label={t("searchPlaceholder")}
        />

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
                  aria-label={t(action.label)}
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
                aria-label={t(action.label)}
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
                  <div className={styles.profileText}>
                    <Text className={styles.name}>{config.profile.name}</Text>
                    <Text className={styles.role}>{config.profile.roleTitle}</Text>
                  </div>

                  <Avatar
                    src={config.profile.avatarSrc}
                    radius="xl"
                    size={38}
                    color="cyan"
                  >
                    {config.profile.avatarFallback ?? config.profile.name.slice(0, 2)}
                  </Avatar>

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
                      {t(item.label)}
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
                    {t(item.label)}
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
