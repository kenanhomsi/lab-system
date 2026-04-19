"use client";

import { IconCalendarEvent } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalTypes: number;
  visibleTypes: number;
  onOpenCreate: () => void;
};

const Header = ({ totalTypes, onOpenCreate }: Props) => {
  const t = useTranslations("admin.settings.appointmentTypes");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("subtitle")}
      icon={<IconCalendarEvent size={22} />}
      iconColor="blue"
      totalCount={totalTypes}
      createLabel={t("create")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { Header as AppointmentTypesHeader };
