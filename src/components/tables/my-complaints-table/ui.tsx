"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { CreateComplaintModal, MyComplaintsHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const complaintsData = useMirror("complaintsData");
  const setIsCreateModalOpen = useMirror("setIsCreateModalOpen");

  const items = complaintsData.items ?? [];

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={items}
        paginationStatic={{
          count: complaintsData.totalCount || 0,
          limit: complaintsData.pageSize || 20,
          page: complaintsData.page || 1,
        }}
      >
        <Table.Header>
          <MyComplaintsHeader
            totalComplaints={complaintsData.totalCount || 0}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        </Table.Header>
      </Table>

      <CreateComplaintModal />
    </Stack>
  );
};

export { UI };
