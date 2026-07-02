"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getBannerColumns } from "./columns";

const SchemaForBanners = (props: PropsWithChildren) => {
    const t = useTranslations("admin.settings.banners");
    const tPageTarget = useTranslations("admin.settings.pageTarget");
    const schema = useMemo(
        () =>
            getBannerColumns(
                t as Translate,
                tPageTarget as Translate,
            ),
        [t, tPageTarget],
    );
    useMirrorRegistry("schema", schema);
    return <>{props.children}</>;
};

type Translate = (key: string, params?: Record<string, string>) => string;

export { SchemaForBanners };
