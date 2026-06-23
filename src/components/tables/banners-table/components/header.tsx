"use client";

import { IconRectangle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";
import { useMirror } from "../store";

type Props = {
    totalBanners: number;
    visibleBanners: number;
    onOpenCreate: () => void;
};

const Header = ({ totalBanners, onOpenCreate }: Props) => {
    const t = useTranslations("admin.settings.banners");
    const setSelectedBanner = useMirror("setSelectedBanner");

    return (
        <TablePageHeader
            title={t("title")}
            description={t("subtitle")}
            icon={<IconRectangle size={22} />}
            iconColor="blue"
            totalCount={totalBanners}
            createLabel={t("create")}
            onOpenCreate={() => {
                setSelectedBanner(null);
                onOpenCreate();
            }}
        />
    );
};

export { Header as BannersHeader };
