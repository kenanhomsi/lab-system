"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { IconPlus, IconSlideshow } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const slidersData = useMirror("slidersData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedSlider = useMirror("setSelectedSlider");

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={slidersData}
      paginationStatic={{
        count: slidersData.length,
        limit: 20,
        page: 1,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("sliders")}
          description={t("slidersDesc")}
          icon={<IconSlideshow size={22} />}
          iconColor="teal"
          totalCount={slidersData.length}
          createLabel={t("createSlider")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedSlider(null);
            setActiveModal("create");
          }}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
