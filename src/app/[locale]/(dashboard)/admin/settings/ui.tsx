"use client";

import { Stack, Tabs, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { QUICK_ACTION_TAB_PARAM } from "@/lib/quick-actions/constants";
import { clearPendingQuickAction } from "@/lib/quick-actions/storage";

import { AccessPoliciesTable } from "@/components/tables/access-policies-table";
import { RolesTable } from "@/components/tables/roles-table";
import { BannersTable } from "@/components/tables/banners-table";
import { AdsTable } from "@/components/tables/ads-table";
import { SlideCardsTable } from "@/components/tables/slide-cards-table";
import { WelcomePagesTable } from "@/components/tables/welcome-pages-table";
import { WebsitePagesTable } from "@/components/tables/website-pages-table";
import { MedicalTestCategoriesTable } from "@/components/tables/medical-test-categories-table";
import { AccountingSettingsForm } from "@/components/forms/accounting-settings-form/AccountingSettingsForm";

const AdminSettingsUI = () => {
  const t = useTranslations("admin.settings");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tabFromUrl = searchParams.get(QUICK_ACTION_TAB_PARAM);
  const [activeTab, setActiveTab] = useState(() => tabFromUrl ?? "roles");

  const handleTabChange = (value: string | null) => {
    if (!value) {
      return;
    }

    setActiveTab(value);
    clearPendingQuickAction();

    const params = new URLSearchParams(searchParams.toString());
    params.set(QUICK_ACTION_TAB_PARAM, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Stack gap="lg" p={{ base: "sm", md: "md" }}>
      <div>
        <Text fw={700} fz={26}>
          {t("title")}
        </Text>
        <Text c="dimmed" size="sm">
          {t("description")}
        </Text>
      </div>

      <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="roles">{t("tabRoles")}</Tabs.Tab>
          <Tabs.Tab value="accessPolicies">{t("tabAccessPolicies")}</Tabs.Tab>
          <Tabs.Tab value="ads">{t("tabAds")}</Tabs.Tab>
          <Tabs.Tab value="banners">{t("tabBanners")}</Tabs.Tab>
          <Tabs.Tab value="slideCards">{t("tabSlideCards")}</Tabs.Tab>
          <Tabs.Tab value="welcomePages">{t("tabWelcomePages")}</Tabs.Tab>
          <Tabs.Tab value="websitePages">{t("tabWebsitePages")}</Tabs.Tab>
          <Tabs.Tab value="medicalTestCategories">{t("tabMedicalTestCategories")}</Tabs.Tab>
          <Tabs.Tab value="accounting">{t("tabAccounting")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="roles" pt="md">
          <RolesTable />
        </Tabs.Panel>
        <Tabs.Panel value="accessPolicies" pt="md">
          <AccessPoliciesTable />
        </Tabs.Panel>

        <Tabs.Panel value="ads" pt="md">
          <AdsTable />
        </Tabs.Panel>
        <Tabs.Panel value="banners" pt="md">
          <BannersTable />
        </Tabs.Panel>
        <Tabs.Panel value="slideCards" pt="md">
          <SlideCardsTable />
        </Tabs.Panel>
        <Tabs.Panel value="welcomePages" pt="md">
          <WelcomePagesTable />
        </Tabs.Panel>
        <Tabs.Panel value="websitePages" pt="md">
          <WebsitePagesTable />
        </Tabs.Panel>
        <Tabs.Panel value="medicalTestCategories" pt="md">
          <MedicalTestCategoriesTable />
        </Tabs.Panel>
        <Tabs.Panel value="accounting" pt="md">
          <AccountingSettingsForm />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export { AdminSettingsUI };
