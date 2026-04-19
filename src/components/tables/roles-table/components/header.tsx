"use client";

import { IconShield } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalRoles: number;
  visibleRoles: number;
  onOpenCreate: () => void;
};

const Header = ({ totalRoles, onOpenCreate }: Props) => {
  const t = useTranslations("admin.settings.roles");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("subtitle")}
      icon={<IconShield size={22} />}
      iconColor="violet"
      totalCount={totalRoles}
      createLabel={t("create")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { Header as RolesHeader };
