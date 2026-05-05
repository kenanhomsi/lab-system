"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { ActionIcon, CloseButton, Select, TextInput, Tooltip } from "@mantine/core";
import { IconArrowsSort, IconClipboardList, IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { useMirror } from "./store";

const UI = () => {
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

  const hasActiveFilters = Boolean(searchValue.trim()) || sortBy !== "createdAt" || !sortDesc;

  return (
    <Table type="normal" isLoading={isPending} schema={schema} OnPageNumberChange={setPageNumber} data={testResultsData?.items || []}
      paginationStatic={{ count: testResultsData?.totalCount || 0, limit: testResultsData?.pageSize || pageSize || 20, page: testResultsData?.page || pageNumber || 1 }}>
      <Table.Header>
        <TablePageHeader title="Test Results" description="Manage lab test results" icon={<IconClipboardList size={22} />} iconColor="teal"
          totalCount={testResultsData?.totalCount || 0} createLabel="Create Test Result" createIcon={<IconPlus size={15} />}
          onOpenCreate={() => { setSelectedTestResult(null); setActiveModal("create"); }} hasActiveFilters={hasActiveFilters}
          onResetFilters={() => { setSearchValue(""); setSortBy("createdAt"); setSortDesc(true); setPageNumber(1); }}>
          <TextInput placeholder="Search by test request id" value={searchValue} onChange={(e) => setSearchValue(e.currentTarget.value)} leftSection={<IconSearch size={14} />}
            rightSection={searchValue ? <CloseButton onClick={() => setSearchValue("")} size="sm" /> : null} rightSectionPointerEvents="auto" radius="xl" size="xs" style={{ flex: "1 1 240px", minWidth: 200 }} />
          <Select placeholder="Sort by" value={sortBy} onChange={(v) => setSortBy(v || "createdAt")} leftSection={<IconArrowsSort size={13} />} radius="xl" size="xs"
            data={[{ value: "createdAt", label: "Created At" }, { value: "resultDate", label: "Result Date" }, { value: "testRequestId", label: "Test Request ID" }]} style={{ minWidth: 140, flex: "0 0 auto" }} />
          <Select value={sortDesc ? "desc" : "asc"} onChange={(v) => setSortDesc((v || "desc") === "desc")} radius="xl" size="xs"
            data={[{ value: "desc", label: "Newest First" }, { value: "asc", label: "Oldest First" }]} style={{ minWidth: 130, flex: "0 0 auto" }} />
          {hasActiveFilters && (
            <Tooltip label="Reset filters" withArrow>
              <ActionIcon variant="light" color="gray" radius="xl" size="md" onClick={() => { setSearchValue(""); setSortBy("createdAt"); setSortDesc(true); setPageNumber(1); }}>
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
