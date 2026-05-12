"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { RolesHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const rolesData = useMirror("rolesData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedRole = useMirror("setSelectedRole");
  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={rolesData?.items || []}
        paginationStatic={{
          count: rolesData?.totalPages || 0,
          limit: rolesData?.pageSize,
          page: rolesData?.page,
        }}
      >
        <Table.Header>
          <RolesHeader
            totalRoles={rolesData?.totalCount || 0}
            visibleRoles={rolesData?.totalPages || 0}
            onOpenCreate={() => {
              setSelectedRole(null);
              setActiveModal("create");
            }}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
