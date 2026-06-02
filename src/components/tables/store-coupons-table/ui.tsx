"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { IconDiscount, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const couponsData = useMirror("couponsData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedCoupon = useMirror("setSelectedCoupon");

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={couponsData}
      paginationStatic={{
        count: couponsData.length,
        limit: 20,
        page: 1,
      }}
    >
      <Table.Header>
        <TablePageHeader
          title={t("coupons")}
          description={t("couponsDesc")}
          icon={<IconDiscount size={22} />}
          iconColor="orange"
          totalCount={couponsData.length}
          createLabel={t("createCoupon")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedCoupon(null);
            setActiveModal("create");
          }}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
