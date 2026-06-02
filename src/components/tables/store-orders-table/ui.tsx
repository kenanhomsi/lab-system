"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { IconShoppingCart } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const pageNumber = useMirror("pageNumber");
  const setPageNumber = useMirror("setPageNumber");
  const ordersData = useMirror("ordersData");

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={ordersData.items}
      paginationStatic={{
        count: ordersData.totalCount,
        limit: ordersData.pageSize,
        page: ordersData.page || pageNumber,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("orders")}
          description={t("ordersDesc")}
          icon={<IconShoppingCart size={22} />}
          iconColor="blue"
          totalCount={ordersData.totalCount}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
