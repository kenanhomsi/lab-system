"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { IconCategory, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.medicalTestCategories");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const categoriesData = useMirror("categoriesData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedCategory = useMirror("setSelectedCategory");

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={categoriesData.items}
      paginationStatic={{
        count: categoriesData.totalCount,
        limit: categoriesData.pageSize,
        page: categoriesData.page,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          icon={<IconCategory size={22} />}
          iconColor="teal"
          totalCount={categoriesData.totalCount}
          createLabel={t("createLabel")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedCategory(null);
            setActiveModal("create");
          }}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
