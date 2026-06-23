"use client";

import { IconCalendarTime } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalAvailabilities: number;
  onOpenCreate: () => void;
};

/**
 * Header for the blood draw availabilities table.
 */
const Header = ({ totalAvailabilities, onOpenCreate }: Props) => {
  const t = useTranslations("admin.availabilities");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("subtitle")}
      icon={<IconCalendarTime size={22} />}
      iconColor="teal"
      totalCount={totalAvailabilities}
      createLabel={t("create")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { Header as AvailabilitiesHeader };
