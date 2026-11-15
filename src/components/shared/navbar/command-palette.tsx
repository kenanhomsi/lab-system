"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Modal } from "@mantine/core";
import { FiArrowRight, FiCornerDownLeft, FiSearch } from "react-icons/fi";
import type { IconType } from "react-icons/lib";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useQuickActionNavigate } from "@/hooks/use-quick-action-navigate";
import { SIDEBAR_ICONS } from "@/components/shared/sidebar/icons";
import type { sideBarItem } from "@/components/shared/sidebar/type";
import { QUICK_ACTION_ICONS } from "./icons";
import type { navbarPaletteLink, navbarQuickAction } from "./type";
import styles from "./command-palette.module.scss";

type PaletteItem = {
  id: string;
  section: "actions" | "pages" | "settings";
  label: string;
  hint?: string;
  icon: IconType;
  current?: boolean;
  run: () => void;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  navItems: sideBarItem[];
  quickActions: navbarQuickAction[];
  paletteLinks?: navbarPaletteLink[];
};

const normalize = (value: string, locale: string) =>
  value.trim().toLocaleLowerCase(locale);

/**
 * Keyboard-first command palette: jump to any page of the current role or
 * start a create action. Arrow keys move, Enter opens, Esc closes.
 */
export const CommandPalette = ({
  opened,
  onClose,
  navItems,
  quickActions,
  paletteLinks = [],
}: Props) => {
  const tSidebar = useTranslations("sidebar") as (key: string) => string;
  const tNavbar = useTranslations("navbar") as (key: string) => string;
  const t = useTranslations("commandPalette");
  const tRoot = useTranslations() as (key: string) => string;
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const runQuickAction = useQuickActionNavigate();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo<PaletteItem[]>(() => {
    const actions: PaletteItem[] = quickActions.map((action) => ({
      id: `action-${action.id}`,
      section: "actions",
      label: tNavbar(`quickActions.${action.label}`),
      hint: tNavbar(`quickActions.${action.description}`),
      icon: QUICK_ACTION_ICONS[action.icon],
      run: () => runQuickAction(action),
    }));

    const pages: PaletteItem[] = navItems.map((item) => ({
      id: `page-${item.href}`,
      section: "pages",
      label: tSidebar(item.label),
      hint: item.group ? tSidebar(item.group) : undefined,
      icon: SIDEBAR_ICONS[item.icon],
      current: pathname === item.href || pathname.startsWith(`${item.href}/`),
      run: () => router.push(item.href),
    }));

    const links: PaletteItem[] = paletteLinks.map((link) => ({
      id: `link-${link.id}`,
      section: "settings",
      label: tRoot(link.labelKey),
      hint: link.hintKey ? tRoot(link.hintKey) : undefined,
      icon: SIDEBAR_ICONS[link.icon],
      run: () => router.push(link.href),
    }));

    return [...actions, ...pages, ...links];
  }, [
    navItems,
    paletteLinks,
    pathname,
    quickActions,
    router,
    runQuickAction,
    tNavbar,
    tRoot,
    tSidebar,
  ]);

  // Settings sub-sections are only listed once the user starts typing, to keep the default list short.
  const hasQuery = query.trim().length > 0;

  const filtered = useMemo(() => {
    const q = normalize(query, locale);
    if (!q) return allItems.filter((item) => item.section !== "settings");
    return allItems.filter((item) =>
      normalize(`${item.label} ${item.hint ?? ""}`, locale).includes(q),
    );
  }, [allItems, locale, query]);

  const handleClose = () => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  };

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>("[data-active='true']")
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const select = (item: PaletteItem | undefined) => {
    if (!item) return;
    handleClose();
    item.run();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(filtered[activeIndex]);
    }
  };

  const renderSection = (section: PaletteItem["section"]) => {
    const entries = filtered
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.section === section);
    if (entries.length === 0) return null;

    return (
      <div className={styles.section} role="group" aria-label={t(section)}>
        <p className={styles.sectionLabel}>{t(section)}</p>
        {entries.map(({ item, index }) => {
          const Icon = item.icon;
          const active = index === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={active}
              data-active={active ? "true" : undefined}
              className={styles.item}
              onMouseMove={() => setActiveIndex(index)}
              onClick={() => select(item)}
            >
              <span
                className={`${styles.itemIcon} ${section === "actions" ? styles.itemIconAction : ""}`}
              >
                <Icon size={16} aria-hidden />
              </span>
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{item.label}</span>
                {item.hint ? <span className={styles.itemHint}>{item.hint}</span> : null}
              </span>
              {item.current ? <span className={styles.currentBadge}>{t("current")}</span> : null}
              <FiArrowRight size={14} className={styles.itemArrow} aria-hidden />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton={false}
      padding={0}
      size={580}
      radius="lg"
      yOffset="10vh"
      classNames={{ content: styles.content }}
      aria-label={t("title")}
    >
      <div className={styles.searchRow}>
        <FiSearch size={18} className={styles.searchIcon} aria-hidden />
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t("placeholder")}
          className={styles.searchInput}
          aria-label={t("placeholder")}
          role="combobox"
          aria-expanded="true"
          aria-controls="command-palette-list"
        />
        <kbd className={styles.kbd}>Esc</kbd>
      </div>

      <div ref={listRef} id="command-palette-list" role="listbox" className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <>
            {renderSection("actions")}
            {renderSection("pages")}
            {hasQuery ? renderSection("settings") : null}
          </>
        )}
      </div>

      <div className={styles.footer}>
        <span>
          <kbd className={styles.kbd}>↑</kbd>
          <kbd className={styles.kbd}>↓</kbd> {t("hintNavigate")}
        </span>
        <span>
          <kbd className={styles.kbd}>
            <FiCornerDownLeft size={11} aria-hidden />
          </kbd>{" "}
          {t("hintSelect")}
        </span>
      </div>
    </Modal>
  );
};
