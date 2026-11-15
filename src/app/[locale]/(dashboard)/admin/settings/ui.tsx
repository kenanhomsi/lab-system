"use client";

import dynamic from "next/dynamic";
import { Center, Loader, Select, TextInput } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ComponentType } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FiArrowRight, FiChevronRight, FiSearch } from "react-icons/fi";
import { usePathname, useRouter } from "@/i18n/navigation";
import { QUICK_ACTION_TAB_PARAM } from "@/lib/quick-actions/constants";
import { clearPendingQuickAction } from "@/lib/quick-actions/storage";
import { SIDEBAR_ICONS } from "@/components/shared/sidebar/icons";
import {
  SETTINGS_GROUPS,
  SETTINGS_SECTIONS,
  isSettingsSectionKey,
  type SettingsSectionKey,
} from "@/components/admin/settings/sections";
import styles from "./styles.module.scss";

const TabLoader = () => (
  <Center py="xl">
    <Loader color="cyan" />
  </Center>
);

const RolesTable = dynamic(
  () => import("@/components/tables/roles-table").then((module) => module.RolesTable),
  { loading: TabLoader },
);
const AccessPoliciesTable = dynamic(
  () =>
    import("@/components/tables/access-policies-table").then(
      (module) => module.AccessPoliciesTable,
    ),
  { loading: TabLoader },
);
const BannersTable = dynamic(
  () => import("@/components/tables/banners-table").then((module) => module.BannersTable),
  { loading: TabLoader },
);
const AdsTable = dynamic(
  () => import("@/components/tables/ads-table").then((module) => module.AdsTable),
  { loading: TabLoader },
);
const SlideCardsTable = dynamic(
  () =>
    import("@/components/tables/slide-cards-table").then((module) => module.SlideCardsTable),
  { loading: TabLoader },
);
const WelcomePagesTable = dynamic(
  () =>
    import("@/components/tables/welcome-pages-table").then((module) => module.WelcomePagesTable),
  { loading: TabLoader },
);
const WebsitePagesTable = dynamic(
  () =>
    import("@/components/tables/website-pages-table").then((module) => module.WebsitePagesTable),
  { loading: TabLoader },
);
const WebsiteContentMapPanel = dynamic(
  () =>
    import("@/components/admin/website-content-map").then(
      (module) => module.WebsiteContentMapPanel,
    ),
  { loading: TabLoader },
);
const NavbarConfigPanel = dynamic(
  () => import("@/components/admin/navbar-config").then((module) => module.NavbarConfigPanel),
  { loading: TabLoader },
);
const MedicalTestCategoriesTable = dynamic(
  () =>
    import("@/components/tables/medical-test-categories-table").then(
      (module) => module.MedicalTestCategoriesTable,
    ),
  { loading: TabLoader },
);
const AccountingSettingsForm = dynamic(
  () =>
    import("@/components/forms/accounting-settings-form/AccountingSettingsForm").then(
      (module) => module.AccountingSettingsForm,
    ),
  { loading: TabLoader },
);

const SECTION_COMPONENTS: Record<SettingsSectionKey, ComponentType> = {
  roles: RolesTable,
  accessPolicies: AccessPoliciesTable,
  websiteContentMap: WebsiteContentMapPanel,
  navbar: NavbarConfigPanel,
  websitePages: WebsitePagesTable,
  slideCards: SlideCardsTable,
  banners: BannersTable,
  ads: AdsTable,
  welcomePages: WelcomePagesTable,
  medicalTestCategories: MedicalTestCategoriesTable,
  accounting: AccountingSettingsForm,
};

/**
 * Admin settings: sections grouped by purpose (access, website content,
 * lookups, dashboard content) with a searchable side nav, an overview landing
 * that explains each section, and `?tab=` deep links.
 */
const AdminSettingsUI = () => {
  const t = useTranslations("admin.settings") as (key: string) => string;
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState("");

  const tabParam = searchParams.get(QUICK_ACTION_TAB_PARAM);
  const activeKey: SettingsSectionKey | null = isSettingsSectionKey(tabParam) ? tabParam : null;
  const activeSection = SETTINGS_SECTIONS.find((section) => section.key === activeKey);

  const openSection = (key: SettingsSectionKey | null) => {
    clearPendingQuickAction();
    const params = new URLSearchParams(searchParams.toString());
    if (key) {
      params.set(QUICK_ACTION_TAB_PARAM, key);
    } else {
      params.delete(QUICK_ACTION_TAB_PARAM);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const sectionDescription = (key: SettingsSectionKey) => t(`sectionInfo.${key}`);

  const filteredGroups = useMemo(() => {
    const q = filter.trim().toLocaleLowerCase(locale);
    if (!q) return SETTINGS_GROUPS;
    return SETTINGS_GROUPS.map((group) => ({
      ...group,
      sections: group.sections.filter((section) =>
        `${t(section.labelKey)} ${t(`sectionInfo.${section.key}`)} ${t(`groups.${group.key}.title`)}`
          .toLocaleLowerCase(locale)
          .includes(q),
      ),
    })).filter((group) => group.sections.length > 0);
  }, [filter, locale, t]);

  const selectData = SETTINGS_GROUPS.map((group) => ({
    group: t(`groups.${group.key}.title`),
    items: group.sections.map((section) => ({
      value: section.key,
      label: t(section.labelKey),
    })),
  }));

  const ActiveComponent = activeKey ? SECTION_COMPONENTS[activeKey] : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb} aria-label={t("breadcrumbLabel")}>
          {activeSection ? (
            <>
              <button type="button" className={styles.crumbLink} onClick={() => openSection(null)}>
                {t("title")}
              </button>
              <FiChevronRight size={14} className={styles.crumbSep} aria-hidden />
              <span className={styles.crumbMuted}>
                {t(`groups.${activeSection.group}.title`)}
              </span>
              <FiChevronRight size={14} className={styles.crumbSep} aria-hidden />
              <span className={styles.crumbCurrent} aria-current="page">
                {t(activeSection.labelKey)}
              </span>
            </>
          ) : (
            <span className={styles.crumbCurrent} aria-current="page">
              {t("title")}
            </span>
          )}
        </nav>
        <h1 className={styles.title}>{activeSection ? t(activeSection.labelKey) : t("title")}</h1>
        <p className={styles.description}>
          {activeSection ? sectionDescription(activeSection.key) : t("description")}
        </p>
      </header>

      {/* Small screens: grouped dropdown instead of the side nav */}
      <Select
        className={styles.mobilePicker}
        data={selectData}
        value={activeKey}
        onChange={(value) => openSection(isSettingsSectionKey(value) ? value : null)}
        placeholder={t("overviewTitle")}
        clearable
        searchable
        aria-label={t("pickSection")}
        comboboxProps={{ withinPortal: true }}
      />

      <div className={styles.layout}>
        <aside className={styles.nav} aria-label={t("pickSection")}>
          <TextInput
            value={filter}
            onChange={(event) => setFilter(event.currentTarget.value)}
            placeholder={t("searchPlaceholder")}
            leftSection={<FiSearch size={14} />}
            size="sm"
            radius="md"
            className={styles.navSearch}
            aria-label={t("searchPlaceholder")}
          />

          <button
            type="button"
            className={`${styles.navItem} ${!activeKey ? styles.navItemActive : ""}`}
            onClick={() => openSection(null)}
            aria-current={!activeKey ? "page" : undefined}
          >
            <span className={styles.navIcon}>
              <SIDEBAR_ICONS.home size={15} aria-hidden />
            </span>
            <span className={styles.navText}>
              <span className={styles.navLabel}>{t("overviewTitle")}</span>
            </span>
          </button>

          {filteredGroups.map((group) => (
            <div key={group.key} className={styles.navGroup}>
              <p className={styles.navGroupLabel}>{t(`groups.${group.key}.title`)}</p>
              {group.sections.map((section) => {
                const Icon = SIDEBAR_ICONS[section.icon];
                const active = section.key === activeKey;
                return (
                  <button
                    key={section.key}
                    type="button"
                    className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                    onClick={() => openSection(section.key)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className={styles.navIcon}>
                      <Icon size={15} aria-hidden />
                    </span>
                    <span className={styles.navText}>
                      <span className={styles.navLabel}>{t(section.labelKey)}</span>
                      <span className={styles.navHint}>{sectionDescription(section.key)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          {filteredGroups.length === 0 ? (
            <p className={styles.navEmpty}>{t("searchEmpty")}</p>
          ) : null}
        </aside>

        <section className={styles.content}>
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className={styles.overview}>
              {SETTINGS_GROUPS.map((group) => {
                const GroupIcon = SIDEBAR_ICONS[group.icon];
                return (
                  <div key={group.key} className={styles.overviewGroup}>
                    <div className={styles.overviewGroupHead}>
                      <span className={styles.overviewGroupIcon}>
                        <GroupIcon size={18} aria-hidden />
                      </span>
                      <div>
                        <h2 className={styles.overviewGroupTitle}>
                          {t(`groups.${group.key}.title`)}
                        </h2>
                        <p className={styles.overviewGroupDesc}>
                          {t(`groups.${group.key}.description`)}
                        </p>
                      </div>
                    </div>
                    <div className={styles.overviewCards}>
                      {group.sections.map((section) => {
                        const Icon = SIDEBAR_ICONS[section.icon];
                        return (
                          <button
                            key={section.key}
                            type="button"
                            className={styles.overviewCard}
                            onClick={() => openSection(section.key)}
                          >
                            <span className={styles.navIcon}>
                              <Icon size={16} aria-hidden />
                            </span>
                            <span className={styles.navText}>
                              <span className={styles.overviewCardTitle}>
                                {t(section.labelKey)}
                              </span>
                              <span className={styles.overviewCardDesc}>
                                {sectionDescription(section.key)}
                              </span>
                            </span>
                            <FiArrowRight size={14} className={styles.overviewArrow} aria-hidden />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export { AdminSettingsUI };
