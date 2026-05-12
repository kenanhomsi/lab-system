"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { AccessPoliciesHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const policiesData = useMirror("policiesData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedPolicy = useMirror("setSelectedPolicy");

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={policiesData}
        paginationStatic={{
          count: policiesData.length,
          limit: Math.max(policiesData.length, 20),
          page: 1,
        }}
      >
        <Table.Header>
          <AccessPoliciesHeader
            totalPolicies={policiesData.length}
            visiblePolicies={policiesData.length}
            onOpenCreate={() => {
              setSelectedPolicy(null);
              setActiveModal("create");
            }}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
