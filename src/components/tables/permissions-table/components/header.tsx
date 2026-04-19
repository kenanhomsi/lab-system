"use client";

import { IconKey } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalPermissions: number;
  visiblePermissions: number;
  onOpenCreate: () => void;
};

const Header = ({ totalPermissions, onOpenCreate }: Props) => {
  const t = useTranslations("admin.settings.permissions");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("subtitle")}
      icon={<IconKey size={22} />}
      iconColor="indigo"
      totalCount={totalPermissions}
      createLabel={t("create")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { Header as PermissionsHeader };
