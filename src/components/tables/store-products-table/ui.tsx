"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { IconPackage, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const pageNumber = useMirror("pageNumber");
  const setPageNumber = useMirror("setPageNumber");
  const productsData = useMirror("productsData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedProduct = useMirror("setSelectedProduct");

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={productsData.items}
      paginationStatic={{
        count: productsData.totalCount,
        limit: productsData.pageSize,
        page: productsData.page || pageNumber,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("products")}
          description={t("productsDesc")}
          icon={<IconPackage size={22} />}
          iconColor="teal"
          totalCount={productsData.totalCount}
          createLabel={t("createProduct")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedProduct(null);
            setActiveModal("create");
          }}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
