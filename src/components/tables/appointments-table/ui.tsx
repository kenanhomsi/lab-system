"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { AppointmentsHeader } from "./components";
import { useMirror } from "./store";

/**
 * Renders the blood draw appointments management table.
 */
const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const appointmentsData = useMirror("appointmentsData") ?? [];
  const appointmentsPage = useMirror("appointmentsPage");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const statusFilter = useMirror("statusFilter");
  const setStatusFilter = useMirror("setStatusFilter");

  const hasActiveFilters = Boolean(searchValue.trim()) || statusFilter !== "all";

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPageNumber(1);
  };

  const handleStatusChange = (value: "all" | string) => {
    setStatusFilter(value);
    setPageNumber(1);
  };

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={appointmentsData}
        paginationStatic={{
          count: appointmentsPage.totalCount,
          limit: appointmentsPage.pageSize,
          page: appointmentsPage.page,
        }}
        tableStriped
        tableHighlightOnHover
        dataTableVerticalSpacing="md"
        dataTableHorizontalSpacing="sm"
      >
        <Table.Header>
          <AppointmentsHeader
            totalAppointments={appointmentsPage.totalCount}
            hasActiveFilters={hasActiveFilters}
            searchValue={searchValue}
            setSearchValue={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            onResetFilters={() => {
              setSearchValue("");
              setStatusFilter("all");
              setPageNumber(1);
            }}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
