"use client";

import { IconShieldLock } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalPolicies: number;
  visiblePolicies: number;
  onOpenCreate: () => void;
};

const Header = ({ totalPolicies, onOpenCreate }: Props) => {
  const t = useTranslations("admin.settings.accessPolicies");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("subtitle")}
      icon={<IconShieldLock size={22} />}
      iconColor="indigo"
      totalCount={totalPolicies}
      createLabel={t("create")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { Header as AccessPoliciesHeader };
