"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import {
  ContractServiceRequestsHeader,
  DeleteConfirmModal,
  DetailModal,
  StatusUpdateModal,
} from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const requestsData = useMirror("requestsData");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const statusFilter = useMirror("statusFilter");
  const setStatusFilter = useMirror("setStatusFilter");
  const setSelectedRequest = useMirror("setSelectedRequest");
  const setIsDetailModalOpen = useMirror("setIsDetailModalOpen");

  const hasActiveFilters = Boolean(searchValue.trim()) || statusFilter !== "all";

  const handleRowClick = (id: string) => {
    const numericId = Number(id);
    const request = requestsData.items.find((item) => item.id === numericId);
    if (!request) return;
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={requestsData.items ?? []}
        onRowClick={handleRowClick}
        paginationStatic={{
          count: requestsData.totalCount || 0,
          limit: requestsData.pageSize || 20,
          page: requestsData.page || 1,
        }}
      >
        <Table.Header>
          <ContractServiceRequestsHeader
            totalCount={requestsData.totalCount || 0}
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

      <DetailModal />
      <StatusUpdateModal />
      <DeleteConfirmModal />
    </Stack>
  );
};

export { UI };
