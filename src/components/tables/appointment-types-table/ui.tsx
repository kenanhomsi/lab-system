"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { AppointmentTypesHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const typesData = useMirror("typesData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedType = useMirror("setSelectedType");

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={typesData}
        paginationStatic={{
          count: typesData.length,
          limit: 20,
          page: 1,
        }}
      >
        <Table.Header>
          <AppointmentTypesHeader
            totalTypes={typesData.length}
            visibleTypes={typesData.length}
            onOpenCreate={() => {
              setSelectedType(null);
              setActiveModal("create");
            }}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
