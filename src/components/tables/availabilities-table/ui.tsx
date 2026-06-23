"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { AvailabilitiesHeader } from "./components";
import { useMirror } from "./store";

/**
 * Renders the blood draw availabilities management table.
 */
const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const availabilitiesData = useMirror("availabilitiesData") ?? [];
  const setActiveModal = useMirror("setActiveModal");

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={availabilitiesData}
        paginationStatic={{
          count: availabilitiesData.length,
          limit: 20,
          page: 1,
        }}
      >
        <Table.Header>
          <AvailabilitiesHeader
            totalAvailabilities={availabilitiesData.length}
            onOpenCreate={() => {
              setActiveModal("create");
            }}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
