"use client";

import { useState } from "react";
import { Center, SegmentedControl, Stack } from "@mantine/core";
import { FiGrid, FiList } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { Table } from "@/components/table";
import { AccessPoliciesHeader } from "./components";
import { AccessMatrix } from "./matrix/access-matrix";
import { useMirror } from "./store";

type View = "matrix" | "list";

/**
 * Access policies: a roles × resources permission matrix (default) for a
 * quick "who can do what" answer, plus the raw rules list for detailed editing.
 */
const UI = () => {
  const t = useTranslations("admin.settings.accessPolicies.matrix");
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const policiesData = useMirror("policiesData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedPolicy = useMirror("setSelectedPolicy");
  const setCreateDraft = useMirror("setCreateDraft");
  const [view, setView] = useState<View>("matrix");

  const openCreate = () => {
    setSelectedPolicy(null);
    setCreateDraft(null);
    setActiveModal("create");
  };

  const header = (
    <AccessPoliciesHeader
      totalPolicies={policiesData.length}
      visiblePolicies={policiesData.length}
      onOpenCreate={openCreate}
    />
  );

  const viewSwitch = (
    <SegmentedControl
      value={view}
      onChange={(value) => setView(value as View)}
      radius="md"
      data={[
        {
          value: "matrix",
          label: (
            <Center style={{ gap: 6 }}>
              <FiGrid size={14} aria-hidden />
              <span>{t("viewMatrix")}</span>
            </Center>
          ),
        },
        {
          value: "list",
          label: (
            <Center style={{ gap: 6 }}>
              <FiList size={14} aria-hidden />
              <span>{t("viewList")}</span>
            </Center>
          ),
        },
      ]}
      aria-label={t("viewLabel")}
    />
  );

  if (view === "matrix") {
    return (
      <Stack>
        {header}
        <div>{viewSwitch}</div>
        <AccessMatrix />
      </Stack>
    );
  }

  return (
    <Stack>
      <div>{viewSwitch}</div>
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
        <Table.Header>{header}</Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
