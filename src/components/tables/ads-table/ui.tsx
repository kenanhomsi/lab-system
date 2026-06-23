"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { AdsHeader } from "./components";
import { useMirror } from "./store";

/**
 * Renders the admin ads management table.
 */
const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const adsData = useMirror("adsData") ?? [];
  const setActiveModal = useMirror("setActiveModal");

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={adsData}
        paginationStatic={{
          count: adsData.length,
          limit: 20,
          page: 1,
        }}
      >
        <Table.Header>
          <AdsHeader
            totalAds={adsData.length}
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
