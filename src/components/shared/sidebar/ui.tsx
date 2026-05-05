"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
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
  FiUserPlus,
  FiActivity,
  FiClipboard,
  FiCheckCircle,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { useLocale, useTranslations } from "next-intl";
import { useMirror } from "./store";
import type { SidebarIconKey } from "./type";
import styles from "./styles.module.scss";

const SIDEBAR_ICONS: Record<SidebarIconKey, IconType> = {
  home: FiHome,
  users: FiUsers,
  calendar: FiCalendar,
  creditCard: FiCreditCard,
  messageSquare: FiMessageSquare,
  settings: FiSettings,
  flask: FiActivity,
  clipboardList: FiClipboard,
  clipboardCheck: FiCheckCircle,
  userPlus: FiUserPlus,
};

const RAIL_W = "72px";
const EXPANDED_W = "260px";
const MOBILE_MAX_WIDTH = 992;
const mobileViewportQuery = `(max-width: ${MOBILE_MAX_WIDTH}px)`;

const subscribeToMobileViewport = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(mobileViewportQuery);

  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
};

const getMobileViewportSnapshot = () => window.matchMedia(mobileViewportQuery).matches;
const getServerMobileViewportSnapshot = () => false;

const UI = () => {
  const t = useTranslations("sidebar") as (key: string) => string;
  const tn = useTranslations("navbar");
  const locale = useLocale();
  const rtl = locale === "ar";

  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobileViewport = useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    getServerMobileViewportSnapshot,
  );

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--dashboard-sidebar-width",
      expanded ? EXPANDED_W : RAIL_W,
    );
    return () => {
      document.documentElement.style.removeProperty("--dashboard-sidebar-width");
    };
  }, [expanded]);

  useEffect(() => {
    const handler = () => {
      if (!isMobileViewport) return;
      setMobileOpen((value) => !value);
    };
    window.addEventListener("dashboard:toggle-sidebar", handler);
    return () => window.removeEventListener("dashboard:toggle-sidebar", handler);
  }, [isMobileViewport]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mobileOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileViewportQuery);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setMobileOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const items = useMirror("items");
  const activeIndex = useMirror("activeIndex");
  const activeUtility = useMirror("activeUtility");
  const setActiveIndex = useMirror("setActiveIndex");
  const setActiveUtility = useMirror("setActiveUtility");

  const isLight = activeUtility === "light";
  const ThemeIcon = isLight ? FiMoon : FiSun;
  const themeLabel = isLight ? tn("darkMode") : tn("lightMode");
  const toggleTheme = () => setActiveUtility(isLight ? "dark" : "light");

  const ExpandIcon = rtl ? FiChevronLeft : FiChevronRight;
  const CollapseIcon = rtl ? FiChevronRight : FiChevronLeft;

  return (
    <>
      <aside
        className={`${styles.sidebar} ${expanded ? styles.expanded : styles.rail}`}
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
              <ActionIcon
                variant="subtle"
                aria-label={themeLabel}
                className={styles.iconButton}
                onClick={toggleTheme}
              >
                <ThemeIcon size={16} aria-hidden />
              </ActionIcon>
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
              <UnstyledButton
                aria-label={themeLabel}
                className={styles.navRow}
                onClick={toggleTheme}
              >
                <ThemeIcon size={17} aria-hidden />
                <span className={styles.navLabel}>{themeLabel}</span>
              </UnstyledButton>
            </Stack>
          </Stack>
        )}
      </aside>

      {isMobileViewport && (
        <>
          <button
            type="button"
            aria-hidden={!mobileOpen}
            className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayVisible : ""}`}
            onClick={() => setMobileOpen(false)}
          />

          <aside className={`${styles.mobilePanel} ${mobileOpen ? styles.mobilePanelOpen : ""}`}>
            <Stack gap="sm" className={styles.mobileContent}>
              <Group justify="space-between" align="center">
                <span className={styles.appsLabel}>{t("apps")}</span>
                <ActionIcon
                  variant="subtle"
                  aria-label={t("collapseSidebar")}
                  className={styles.iconButton}
                  onClick={() => setMobileOpen(false)}
                >
                  <CollapseIcon size={17} aria-hidden />
                </ActionIcon>
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
                      onClick={() => {
                        setActiveIndex(index);
                        setMobileOpen(false);
                      }}
                    >
                      <Icon size={18} aria-hidden />
                      <span className={styles.navLabel}>{t(item.label)}</span>
                    </UnstyledButton>
                  );
                })}
              </Stack>

              <Divider className={styles.divider} />
              <Stack gap={6}>
                <UnstyledButton
                  aria-label={themeLabel}
                  className={styles.navRow}
                  onClick={toggleTheme}
                >
                  <ThemeIcon size={17} aria-hidden />
                  <span className={styles.navLabel}>{themeLabel}</span>
                </UnstyledButton>
              </Stack>
            </Stack>
          </aside>
        </>
      )}
    </>
  );
};

export default UI;
