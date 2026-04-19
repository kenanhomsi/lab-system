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
        data={rolesData}
        paginationStatic={{
          count: rolesData.length,
          limit: 20,
          page: 1,
        }}
      >
        <Table.Header>
          <RolesHeader
            totalRoles={rolesData.length}
            visibleRoles={rolesData.length}
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
