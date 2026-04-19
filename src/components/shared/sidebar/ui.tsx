"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { ActionIcon, Divider, Group, Stack, UnstyledButton } from "@mantine/core";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiCalendar,
  FiHome,
  FiMessageSquare,
  FiMoon,
  FiSettings,
  FiSun,
  FiUsers,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { useLocale, useTranslations } from "next-intl";
import { useMirror } from "./store";
import type { SidebarIconKey, utilityItem } from "./type";
import styles from "./styles.module.scss";

const SIDEBAR_ICONS: Record<SidebarIconKey, IconType> = {
  home: FiHome,
  users: FiUsers,
  calendar: FiCalendar,
  creditCard: FiCreditCard,
  messageSquare: FiMessageSquare,
  settings: FiSettings,
};

const RAIL_W = "64px";
const EXPANDED_W = "232px";

const UI = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("sidebar") as (key: string) => string;
  const tn = useTranslations("navbar");
  const locale = useLocale();
  const rtl = locale === "ar";

  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--dashboard-sidebar-width",
      expanded ? EXPANDED_W : RAIL_W,
    );
    return () => {
      document.documentElement.style.removeProperty("--dashboard-sidebar-width");
    };
  }, [expanded]);

  const items = useMirror("items");
  const activeIndex = useMirror("activeIndex");
  const activeUtility = useMirror("activeUtility");
  const setActiveIndex = useMirror("setActiveIndex");
  const setActiveUtility = useMirror("setActiveUtility");

  const themeOptions: { value: utilityItem; icon: IconType; label: string }[] = [
    { value: "light", icon: FiSun, label: tn("lightMode") },
    { value: "dark", icon: FiMoon, label: tn("darkMode") },
  ];

  const ExpandIcon = rtl ? FiChevronLeft : FiChevronRight;
  const CollapseIcon = rtl ? FiChevronRight : FiChevronLeft;

  return (
    <aside
      className={`${styles.sidebar} ${expanded ? styles.expanded : styles.rail}`}
      aria-expanded={expanded}
    >
      {!expanded ? (
        <Stack justify="space-between" className={styles.content}>
          <Stack gap="xs" align="center">
            <ActionIcon
              variant="subtle"
              aria-label={t("expandSidebar")}
              className={styles.iconButton}
              onClick={() => setExpanded(true)}
            >
              <ExpandIcon size={17} aria-hidden />
            </ActionIcon>

            <Stack gap="xs" align="center">
              {items.map((item, index) => {
                const Icon = SIDEBAR_ICONS[item.icon];
                return (
                  <ActionIcon
                    key={item.href}
                    component={Link}
                    href={item.href}
                    variant="subtle"
                    aria-label={t(item.label)}
                    className={`${styles.iconButton} ${index === activeIndex ? styles.active : ""}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <Icon size={17} aria-hidden />
                  </ActionIcon>
                );
              })}
            </Stack>

            <Divider className={styles.dividerNarrow} />
          </Stack>

          <Stack gap="xs" align="center">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <ActionIcon
                key={value}
                variant="subtle"
                aria-label={label}
                className={`${styles.iconButton} ${activeUtility === value ? styles.activeTheme : ""}`}
                onClick={() => setActiveUtility(value)}
              >
                <Icon size={16} aria-hidden />
              </ActionIcon>
            ))}
          </Stack>
        </Stack>
      ) : (
        <Stack justify="space-between" className={styles.content} gap="md">
          <Stack gap="sm">
            <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
              <span className={styles.appsLabel}>{t("apps")}</span>
              <button
                type="button"
                className={styles.togglePillSmall}
                aria-label={t("collapseSidebar")}
                onClick={() => setExpanded(false)}
              >
                <CollapseIcon size={17} aria-hidden />
              </button>
            </Group>

            <Stack gap={6}>
              {items.map((item, index) => {
                const Icon = SIDEBAR_ICONS[item.icon];
                return (
                  <UnstyledButton
                    key={item.href}
                    component={Link}
                    href={item.href}
                    aria-label={t(item.label)}
                    className={`${styles.navRow} ${index === activeIndex ? styles.active : ""}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <Icon size={18} aria-hidden />
                    <span className={styles.navLabel}>{t(item.label)}</span>
                  </UnstyledButton>
                );
              })}
            </Stack>

            <Divider className={styles.divider} />
          </Stack>

          <Stack gap={6}>
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <UnstyledButton
                key={value}
                aria-label={label}
                className={`${styles.navRow} ${activeUtility === value ? styles.activeTheme : ""}`}
                onClick={() => setActiveUtility(value)}
              >
                <Icon size={17} aria-hidden />
                <span className={styles.navLabel}>{label}</span>
              </UnstyledButton>
            ))}
          </Stack>
        </Stack>
      )}
    </aside>
  );
};

export default UI;
