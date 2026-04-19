"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { SubscriptionPackagesHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const packagesData = useMirror("packagesData");
  const targetAudienceFilter = useMirror("targetAudienceFilter");
  const setTargetAudienceFilter = useMirror("setTargetAudienceFilter");
  const isActiveFilter = useMirror("isActiveFilter");
  const setIsActiveFilter = useMirror("setIsActiveFilter");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedPackage = useMirror("setSelectedPackage");
  const audienceOptions = useMirror("audienceOptions");

  const hasActiveFilters =
    targetAudienceFilter !== "all" || isActiveFilter !== "all";

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={packagesData.items || []}
        paginationStatic={{
          count: packagesData.totalCount || 0,
          limit: packagesData.pageSize || 20,
          page: packagesData.page || 1,
        }}
      >
        <Table.Header>
          <SubscriptionPackagesHeader
            totalPackages={packagesData.totalCount || 0}
            visiblePackages={packagesData.items?.length || 0}
            hasActiveFilters={hasActiveFilters}
            targetAudienceFilter={targetAudienceFilter}
            setTargetAudienceFilter={setTargetAudienceFilter}
            isActiveFilter={isActiveFilter}
            setIsActiveFilter={setIsActiveFilter}
            onOpenCreate={() => {
              setSelectedPackage(null);
              setActiveModal("create");
            }}
            onResetFilters={() => {
              setTargetAudienceFilter("all");
              setIsActiveFilter("all");
              setPageNumber(1);
            }}
            audienceOptions={audienceOptions}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
