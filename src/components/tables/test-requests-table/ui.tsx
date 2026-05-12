"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { ActionIcon, CloseButton, Select, TextInput, Tooltip } from "@mantine/core";
import { IconArrowsSort, IconClipboardList, IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.testRequests");
  const tc = useTranslations("admin.common");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const pageNumber = useMirror("pageNumber");
  const setPageNumber = useMirror("setPageNumber");
  const pageSize = useMirror("pageSize");
  const testRequestsData = useMirror("testRequestsData");
  const sortBy = useMirror("sortBy");
  const setSortBy = useMirror("setSortBy");
  const sortDesc = useMirror("sortDesc");
  const setSortDesc = useMirror("setSortDesc");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedTestRequest = useMirror("setSelectedTestRequest");

  const hasActiveFilters = Boolean(searchValue.trim()) || sortBy !== "createdAt" || !sortDesc;

  const sortFieldOptions = useMemo(
    () => [
      { value: "createdAt", label: t("sortCreatedAt") },
      { value: "requestDate", label: t("sortRequestDate") },
      { value: "totalAmount", label: t("sortTotalAmount") },
    ],
    [t],
  );

  const sortDirOptions = useMemo(
    () => [
      { value: "desc", label: tc("newestFirst") },
      { value: "asc", label: tc("oldestFirst") },
    ],
    [tc],
  );

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={testRequestsData?.items || []}
      paginationStatic={{
        count: testRequestsData?.totalCount || 0,
        limit: testRequestsData?.pageSize || pageSize || 20,
        page: testRequestsData?.page || pageNumber || 1,
      }}
      tableStriped
      tableHighlightOnHover
      dataTableVerticalSpacing="md"
      dataTableHorizontalSpacing="sm"
    >
      <Table.Header>
        <TablePageHeader
          title={t("title")}
          description={t("description")}
          icon={<IconClipboardList size={22} />}
          iconColor="teal"
          totalCount={testRequestsData?.totalCount || 0}
          createLabel={t("createLabel")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedTestRequest(null);
            setActiveModal("create");
          }}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={() => {
            setSearchValue("");
            setSortBy("createdAt");
            setSortDesc(true);
            setPageNumber(1);
          }}
        >
          <TextInput
            placeholder={t("searchPlaceholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
            leftSection={<IconSearch size={14} />}
            rightSection={
              searchValue ? <CloseButton onClick={() => setSearchValue("")} size="sm" /> : null
            }
            rightSectionPointerEvents="auto"
            radius="xl"
            size="xs"
            style={{ flex: "1 1 240px", minWidth: 200 }}
          />
          <Select
            placeholder={tc("sortBy")}
            value={sortBy}
            onChange={(v) => setSortBy(v || "createdAt")}
            leftSection={<IconArrowsSort size={13} />}
            radius="xl"
            size="xs"
            data={sortFieldOptions}
            style={{ minWidth: 140, flex: "0 0 auto" }}
          />
          <Select
            value={sortDesc ? "desc" : "asc"}
            onChange={(v) => setSortDesc((v || "desc") === "desc")}
            radius="xl"
            size="xs"
            data={sortDirOptions}
            style={{ minWidth: 130, flex: "0 0 auto" }}
          />
          {hasActiveFilters && (
            <Tooltip label={t("resetFiltersTooltip")} withArrow>
              <ActionIcon
                variant="light"
                color="gray"
                radius="xl"
                size="md"
                onClick={() => {
                  setSearchValue("");
                  setSortBy("createdAt");
                  setSortDesc(true);
                  setPageNumber(1);
                }}
              >
                <IconRefresh size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </TablePageHeader>
      </Table.Header>
    </Table>
  );
};

export { UI };
