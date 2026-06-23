"use client";

import { isClinicalPatientUser } from "@/components/modals/test-requests/party-ids";
import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { useSessionUserStore } from "@/stores/session-user-store";
import { ActionIcon, Button, CloseButton, Select, TextInput, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowsSort, IconClipboardList, IconDownload, IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  createBulkTestResultsPdfBlob,
  downloadBlob,
  getBulkResultsFileName,
} from "./pdf-export";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.testResults");
  const tc = useTranslations("admin.common");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const pageNumber = useMirror("pageNumber");
  const setPageNumber = useMirror("setPageNumber");
  const pageSize = useMirror("pageSize");
  const testResultsData = useMirror("testResultsData");
  const sortBy = useMirror("sortBy");
  const setSortBy = useMirror("setSortBy");
  const sortDesc = useMirror("sortDesc");
  const setSortDesc = useMirror("setSortDesc");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedTestResult = useMirror("setSelectedTestResult");
  const selectedTestResultIds = useMirror("selectedTestResultIds");
  const setSelectedTestResultIds = useMirror("setSelectedTestResultIds");
  const roles = useSessionUserStore((s) => s.user?.roles);
  const canManageTestResults = !isClinicalPatientUser(roles);
  const [isExportingSelected, setIsExportingSelected] = useState(false);

  const hasActiveFilters = Boolean(searchValue.trim()) || sortBy !== "createdAt" || !sortDesc;

  const sortFieldOptions = useMemo(
    () => [
      { value: "createdAt", label: t("sortCreatedAt") },
      { value: "resultDate", label: t("sortResultDate") },
      { value: "testRequestId", label: t("sortTestRequestId") },
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

  const dataWithRowClick = useMemo(() => {
    return (testResultsData?.items || []).map((item) => ({
      ...item,
      onClick: () => {
        setSelectedTestResult(item);
        setActiveModal("view");
      },
    }));
  }, [testResultsData?.items, setSelectedTestResult, setActiveModal]);

  const selectedRows = useMemo(() => {
    const selectedIds = new Set(selectedTestResultIds);
    return (testResultsData?.items || []).filter((item) => selectedIds.has(item.id));
  }, [selectedTestResultIds, testResultsData?.items]);

  useEffect(() => {
    const visibleIds = new Set((testResultsData?.items || []).map((item) => item.id));
    const nextSelectedIds = selectedTestResultIds.filter((id) => visibleIds.has(id));
    if (nextSelectedIds.length !== selectedTestResultIds.length) {
      setSelectedTestResultIds(nextSelectedIds);
    }
  }, [selectedTestResultIds, setSelectedTestResultIds, testResultsData?.items]);

  const handleExportSelectedPdf = async () => {
    if (selectedRows.length === 0) return;
    setIsExportingSelected(true);
    try {
      const blob = await createBulkTestResultsPdfBlob(selectedRows);
      downloadBlob(blob, getBulkResultsFileName(selectedRows));
    } catch {
      notifications.show({
        color: "red",
        message: t("downloadPdfFailed"),
      });
    } finally {
      setIsExportingSelected(false);
    }
  };

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={dataWithRowClick}
      paginationStatic={{
        count: testResultsData?.totalCount || 0,
        limit: testResultsData?.pageSize || pageSize || 20,
        page: testResultsData?.page || pageNumber || 1,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("title")}
          description={t("description")}
          icon={<IconClipboardList size={22} />}
          iconColor="teal"
          totalCount={testResultsData?.totalCount || 0}
          {...(canManageTestResults
            ? {
                createLabel: t("createLabel"),
                createIcon: <IconPlus size={15} />,
                onOpenCreate: () => {
                  setSelectedTestResult(null);
                  setActiveModal("create");
                },
              }
            : {})}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={() => {
            setSearchValue("");
            setSortBy("createdAt");
            setSortDesc(true);
            setPageNumber(1);
            setSelectedTestResultIds([]);
          }}
        >
          <Button
            leftSection={<IconDownload size={14} />}
            variant="light"
            color="teal"
            radius="xl"
            size="xs"
            disabled={selectedRows.length === 0}
            loading={isExportingSelected}
            onClick={() => void handleExportSelectedPdf()}
          >
            {t("exportSelectedPdf", { count: selectedRows.length })}
          </Button>
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
