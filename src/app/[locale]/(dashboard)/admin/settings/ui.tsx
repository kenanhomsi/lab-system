"use client";

import { Stack, Tabs, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { AppointmentTypesTable } from "@/components/tables/appointment-types-table";
import { PermissionsTable } from "@/components/tables/permissions-table";
import { RolesTable } from "@/components/tables/roles-table";
import { BannersTable } from "@/components/tables/banners-table";

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
          <Tabs.Tab value="roles">{t("tabRoles")}</Tabs.Tab>
          <Tabs.Tab value="permissions">{t("tabPermissions")}</Tabs.Tab>
          <Tabs.Tab value="appointmentTypes">{t("tabAppointmentTypes")}</Tabs.Tab>
          <Tabs.Tab value="banners">{t("tabBanners")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="roles" pt="md">
          <RolesTable />
        </Tabs.Panel>
        <Tabs.Panel value="permissions" pt="md">
          <PermissionsTable />
        </Tabs.Panel>
        <Tabs.Panel value="appointmentTypes" pt="md">
          <AppointmentTypesTable />
        </Tabs.Panel>
        <Tabs.Panel value="banners" pt="md">
          <BannersTable />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export { AdminSettingsUI };
