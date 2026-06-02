"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { IconPhoto, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const bannersData = useMirror("bannersData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedBanner = useMirror("setSelectedBanner");

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={bannersData}
      paginationStatic={{
        count: bannersData.length,
        limit: 20,
        page: 1,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("banners")}
          description={t("bannersDesc")}
          icon={<IconPhoto size={22} />}
          iconColor="teal"
          totalCount={bannersData.length}
          createLabel={t("createBanner")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedBanner(null);
            setActiveModal("create");
          }}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
