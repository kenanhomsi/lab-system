"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { EmploymentApplicationsHeader } from "./components/header";
import { StatusUpdateModal } from "./components/status-update-modal";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const applicationsData = useMirror("applicationsData");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const statusFilter = useMirror("statusFilter");
  const setStatusFilter = useMirror("setStatusFilter");

  const hasActiveFilters = Boolean(searchValue.trim()) || statusFilter !== "all";

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={applicationsData.items || []}
        paginationStatic={{
          count: applicationsData.totalCount || 0,
          limit: applicationsData.pageSize || 20,
          page: applicationsData.page || 1,
        }}
      >
        <Table.Header>
          <EmploymentApplicationsHeader
            totalApplications={applicationsData.totalCount || 0}
            hasActiveFilters={hasActiveFilters}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onResetFilters={() => {
              setSearchValue("");
              setStatusFilter("all");
              setPageNumber(1);
            }}
          />
        </Table.Header>
      </Table>

      <StatusUpdateModal />
    </Stack>
  );
};

export { UI };
