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

  const handleRowClick = (roleId: string) => {
    const role = rolesData?.items?.find((item) => item.id === roleId);
    if (!role) return;
    setSelectedRole(role);
    setActiveModal("permissions");
  };

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        onRowClick={handleRowClick}
        data={rolesData?.items || []}
        paginationStatic={{
          count: rolesData?.totalCount || 0,
          limit: rolesData?.pageSize || 20,
          page: rolesData?.page || 1,
        }}
      >
        <Table.Header>
          <RolesHeader
            totalRoles={rolesData?.totalCount || 0}
            visibleRoles={rolesData?.items?.length || 0}
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
