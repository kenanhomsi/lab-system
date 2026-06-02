"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { useMirror } from "./store";
import { IconBriefcase, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const UI = () => {
  const t = useTranslations("admin.vacantJobs");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const pageNumber = useMirror("pageNumber");
  const setPageNumber = useMirror("setPageNumber");
  const pageSize = useMirror("pageSize");
  const vacantJobsData = useMirror("vacantJobsData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedVacantJob = useMirror("setSelectedVacantJob");

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={vacantJobsData?.items || []}
      paginationStatic={{
        count: vacantJobsData?.totalCount || 0,
        limit: vacantJobsData?.pageSize || pageSize || 20,
        page: vacantJobsData?.page || pageNumber || 1,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          icon={<IconBriefcase size={22} />}
          iconColor="blue"
          totalCount={vacantJobsData?.totalCount || 0}
          createLabel={t("createLabel")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedVacantJob(null);
            setActiveModal("create");
          }}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
