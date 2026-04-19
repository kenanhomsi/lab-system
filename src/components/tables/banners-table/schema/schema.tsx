"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getBannerColumns } from "./columns";

const SchemaForBanners = (props: PropsWithChildren) => {
    const t = useTranslations("admin.settings.banners");
    const schema = useMemo(() => getBannerColumns(t as (key: string) => string), [t]);
    useMirrorRegistry("schema", schema);
    return <>{props.children}</>;
};

export { SchemaForBanners };
