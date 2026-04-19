"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { PermissionsHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const permissionsData = useMirror("permissionsData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedPermission = useMirror("setSelectedPermission");

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={permissionsData}
        paginationStatic={{
          count: permissionsData.length,
          limit: 20,
          page: 1,
        }}
      >
        <Table.Header>
          <PermissionsHeader
            totalPermissions={permissionsData.length}
            visiblePermissions={permissionsData.length}
            onOpenCreate={() => {
              setSelectedPermission(null);
              setActiveModal("create");
            }}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
