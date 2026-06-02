"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import {
  CreateRequestModal,
  DeleteConfirmModal,
  DetailModal,
  MyInsuranceApprovalHeader,
} from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const requestsData = useMirror("requestsData");
  const setIsCreateModalOpen = useMirror("setIsCreateModalOpen");
  const setSelectedRequestId = useMirror("setSelectedRequestId");
  const setIsDetailModalOpen = useMirror("setIsDetailModalOpen");

  const items = requestsData.items ?? [];

  const handleRowClick = (id: string) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    setSelectedRequestId(numericId);
    setIsDetailModalOpen(true);
  };

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={items}
        onRowClick={handleRowClick}
        paginationStatic={{
          count: requestsData.totalCount || 0,
          limit: requestsData.pageSize || 20,
          page: requestsData.page || 1,
        }}
      >
        <Table.Header>
          <MyInsuranceApprovalHeader
            totalRequests={requestsData.totalCount || 0}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        </Table.Header>
      </Table>

      <CreateRequestModal />
      <DetailModal />
      <DeleteConfirmModal />
    </Stack>
  );
};

export { UI };
