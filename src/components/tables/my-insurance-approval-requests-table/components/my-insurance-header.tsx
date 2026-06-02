"use client";

import { IconShield } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalRequests: number;
  onOpenCreate: () => void;
};

const MyInsuranceApprovalHeader = ({ totalRequests, onOpenCreate }: Props) => {
  const t = useTranslations("myInsuranceApproval");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconShield size={22} />}
      iconColor="teal"
      totalCount={totalRequests}
      createLabel={t("newRequest")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { MyInsuranceApprovalHeader };
