"use client";

import { Stack, Tabs, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

import { AccessPoliciesTable } from "@/components/tables/access-policies-table";
import { RolesTable } from "@/components/tables/roles-table";
import { BannersTable } from "@/components/tables/banners-table";
import { SlideCardsTable } from "@/components/tables/slide-cards-table";

const AdminSettingsUI = () => {
  const t = useTranslations("admin.settings");

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

      <Tabs defaultValue="roles" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab defaultChecked value="roles">{t("tabRoles")}</Tabs.Tab>
          <Tabs.Tab value="accessPolicies">{t("tabAccessPolicies")}</Tabs.Tab>
          <Tabs.Tab value="banners">{t("tabBanners")}</Tabs.Tab>
          <Tabs.Tab value="slideCards">{t("tabSlideCards")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel defaultChecked value="roles" pt="md">
          <RolesTable />
        </Tabs.Panel>
        <Tabs.Panel value="accessPolicies" pt="md">
          <AccessPoliciesTable />
        </Tabs.Panel>

        <Tabs.Panel value="banners" pt="md">
          <BannersTable />
        </Tabs.Panel>
        <Tabs.Panel value="slideCards" pt="md">
          <SlideCardsTable />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export { AdminSettingsUI };
