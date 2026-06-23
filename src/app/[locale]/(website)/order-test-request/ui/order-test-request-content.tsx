"use client";

import { TestRequestsTable } from "@/components/tables/test-requests-table";
import { TestResultsTable } from "@/components/tables/test-results-table";
import { Tabs } from "@mantine/core";
import { IconClipboardCheck, IconClipboardList } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function OrderTestRequestContent() {
  const t = useTranslations("patientWebsite.orderTestRequest");

  return (
    <Tabs defaultValue="requests" variant="outline" radius="md" keepMounted={false}>
      <Tabs.List grow>
        <Tabs.Tab value="requests" leftSection={<IconClipboardList size={16} aria-hidden />}>
          {t("tabTestRequests")}
        </Tabs.Tab>
        <Tabs.Tab value="results" leftSection={<IconClipboardCheck size={16} aria-hidden />}>
          {t("tabTestResults")}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="requests" pt="lg">
        <TestRequestsTable />
      </Tabs.Panel>

      <Tabs.Panel value="results" pt="lg">
        <TestResultsTable />
      </Tabs.Panel>
    </Tabs>
  );
}
