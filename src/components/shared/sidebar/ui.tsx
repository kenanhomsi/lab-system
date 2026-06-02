"use client";

import { Link } from "@/i18n/navigation";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ActionIcon, Divider, Group, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiCalendar,
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiUsers,
  FiUserPlus,
  FiActivity,
  FiClipboard,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiBriefcase,
  FiFileText,
  FiShoppingBag,
  FiDollarSign,
  FiLayers,
  FiUserCheck,
  FiFilePlus,
  FiMinusCircle,
  FiBarChart2,
  FiCheckSquare,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { useLocale, useTranslations } from "next-intl";
import { useMirror } from "./store";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { SidebarIconKey, sideBarItem } from "./type";
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
  alertCircle: FiAlertCircle,
  shieldCheck: FiShield,
  briefcase: FiBriefcase,
  fileText: FiFileText,
  store: FiShoppingBag,
  dollarSign: FiDollarSign,
  layers: FiLayers,
  userCheck: FiUserCheck,
  filePlus: FiFilePlus,
  minusCircle: FiMinusCircle,
  barChart: FiBarChart2,
  checkSquare: FiCheckSquare,
};

const RAIL_W = "72px";
const EXPANDED_W = "260px";
const MOBILE_MAX_WIDTH = 992;
const mobileViewportQuery = `(max-width: ${MOBILE_MAX_WIDTH}px)`;

type NavSection = {
  group?: string;
  entries: Array<{ item: sideBarItem; index: number }>;
};

/** Groups consecutive sidebar items that share the same optional group key. */
const buildNavSections = (items: sideBarItem[]): NavSection[] => {
  const sections: NavSection[] = [];

  items.forEach((item, index) => {
    const last = sections[sections.length - 1];
    if (last && last.group === item.group) {
      last.entries.push({ item, index });
      return;
    }
    sections.push({ group: item.group, entries: [{ item, index }] });
  });

  return sections;
};

const subscribeToMobileViewport = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(mobileViewportQuery);

  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
};

const getMobileViewportSnapshot = () => window.matchMedia(mobileViewportQuery).matches;
const getServerMobileViewportSnapshot = () => false;

/**
 * Dashboard sidebar with collapsible rail, scrollable navigation, and optional section groups.
 */
const UI = () => {
  const t = useTranslations("sidebar") as (key: string) => string;
  const locale = useLocale();
  const rtl = locale === "ar";

  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);
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
  const setActiveIndex = useMirror("setActiveIndex");
  const navSections = useMemo(() => buildNavSections(items), [items]);

  useEffect(() => {
    const container = navScrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>("[data-nav-active='true']");
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex, expanded, mobileOpen]);

  const ExpandIcon = rtl ? FiChevronLeft : FiChevronRight;
  const CollapseIcon = rtl ? FiChevronRight : FiChevronLeft;
  const tooltipPosition = rtl ? "left" : "right";

  const renderNavTooltip = (label: string, node: ReactNode) => (
    <Tooltip label={label} withArrow position={tooltipPosition}>
      <span className={styles.tooltipTarget}>{node}</span>
    </Tooltip>
  );

  const renderRailIcons = () =>
    navSections.map((section, sectionIndex) => (
      <div key={section.group ?? `section-${sectionIndex}`} className={styles.navSection}>
        {sectionIndex > 0 ? <Divider className={styles.groupDividerRail} /> : null}
        <Stack gap="xs" align="center">
          {section.entries.map(({ item, index }) => {
            const Icon = SIDEBAR_ICONS[item.icon];
            const label = t(item.label);
            return (
              <span key={item.href} className={styles.tooltipWrap}>
                {renderNavTooltip(
                  label,
                  <ActionIcon
                    component={Link}
                    href={item.href}
                    variant={index === activeIndex ? "filled" : "subtle"}
                    color="brand"
                    aria-label={label}
                    data-nav-active={index === activeIndex ? "true" : undefined}
                    className={`${styles.iconButton} ${index === activeIndex ? styles.active : ""}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <Icon size={17} aria-hidden />
                  </ActionIcon>,
                )}
              </span>
            );
          })}
        </Stack>
      </div>
    ));

  const renderExpandedRows = () =>
    navSections.map((section, sectionIndex) => (
      <div key={section.group ?? `section-${sectionIndex}`} className={styles.navSection}>
        {section.group ? (
          <span className={styles.groupLabel}>{t(section.group)}</span>
        ) : null}
        <Stack gap={6}>
          {section.entries.map(({ item, index }) => {
            const Icon = SIDEBAR_ICONS[item.icon];
            const label = t(item.label);
            return (
              <UnstyledButton
                key={item.href}
                component={Link}
                href={item.href}
                aria-label={label}
                data-nav-active={index === activeIndex ? "true" : undefined}
                className={`${styles.navRow} ${index === activeIndex ? styles.active : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                <Icon size={18} aria-hidden />
                <span className={styles.navLabel}>{label}</span>
              </UnstyledButton>
            );
          })}
        </Stack>
      </div>
    ));

  return (
    <>
      <aside
        className={`${styles.sidebar} ${expanded ? styles.expanded : styles.rail}`}
      >
        {!expanded ? (
          <div className={styles.content}>
            <div className={styles.navHeader}>
              <ActionIcon
                variant="subtle"
                aria-label={t("expandSidebar")}
                className={styles.iconButton}
                onClick={() => setExpanded(true)}
              >
                <ExpandIcon size={17} aria-hidden />
              </ActionIcon>
            </div>

            <div ref={navScrollRef} className={styles.navScroll}>
              {renderRailIcons()}
            </div>

            <div className={styles.navFooter}>
              <Divider className={styles.dividerNarrow} />
              <AnimatedThemeToggler className={styles.iconButton} />
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.navHeader}>
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
            </div>

            <div ref={navScrollRef} className={styles.navScroll}>
              {renderExpandedRows()}
            </div>

            <div className={styles.navFooter}>
              <Divider className={styles.divider} />
              <AnimatedThemeToggler className={styles.navRow} showLabel />
            </div>
          </div>
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
            <div className={styles.mobileContent}>
              <div className={styles.navHeader}>
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
              </div>

              <div className={styles.navScroll}>{renderExpandedRows()}</div>

              <div className={styles.navFooter}>
                <Divider className={styles.divider} />
                <AnimatedThemeToggler className={styles.navRow} showLabel />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default UI;
