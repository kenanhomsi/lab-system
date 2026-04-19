"use client";

import { Table } from "@/components/table";
import { Stack } from "@mantine/core";
import { ComplaintsHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const complaintsData = useMirror("complaintsData");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const statusFilter = useMirror("statusFilter");
  const setStatusFilter = useMirror("setStatusFilter");
  const userIdFilter = useMirror("userIdFilter");
  const setUserIdFilter = useMirror("setUserIdFilter");

  const hasActiveFilters = Boolean(searchValue.trim()) || Boolean(userIdFilter.trim()) || statusFilter !== "all";

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={complaintsData.items || []}
        paginationStatic={{
          count: complaintsData.totalCount || 0,
          limit: complaintsData.pageSize || 20,
          page: complaintsData.page || 1,
        }}
      >
        <Table.Header>
          <ComplaintsHeader
            totalComplaints={complaintsData.totalCount || 0}
            visibleComplaints={complaintsData.items?.length || 0}
            hasActiveFilters={hasActiveFilters}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            userIdFilter={userIdFilter}
            setUserIdFilter={setUserIdFilter}
            onResetFilters={() => {
              setSearchValue("");
              setUserIdFilter("");
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
