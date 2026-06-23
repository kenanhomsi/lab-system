"use client";

import { IconAd2 } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalAds: number;
  onOpenCreate: () => void;
};

/**
 * Header for the admin ads table.
 */
const Header = ({ totalAds, onOpenCreate }: Props) => {
  const t = useTranslations("admin.settings.ads");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("subtitle")}
      icon={<IconAd2 size={22} />}
      iconColor="blue"
      totalCount={totalAds}
      createLabel={t("create")}
      onOpenCreate={onOpenCreate}
    />
  );
};

export { Header as AdsHeader };
