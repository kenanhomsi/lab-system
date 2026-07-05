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
  const availabilitiesPage = useMirror("availabilitiesPage");
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
          count: availabilitiesPage?.totalCount ?? availabilitiesData.length,
          limit: availabilitiesPage?.pageSize ?? 20,
          page: availabilitiesPage?.page ?? 1,
        }}
      >
        <Table.Header>
          <AvailabilitiesHeader
            totalAvailabilities={availabilitiesPage?.totalCount ?? availabilitiesData.length}
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
