"use client";

import { IconMessage } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalComplaints: number;
  onOpenCreate: () => void;
};

const MyComplaintsHeader = ({ totalComplaints, onOpenCreate }: Props) => {
  const t = useTranslations("myComplaints");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconMessage size={22} />}
      iconColor="orange"
      totalCount={totalComplaints}
      createLabel={t("newComplaint")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { MyComplaintsHeader };
