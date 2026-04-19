"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllBanners } from "./get-all-banners";
import { BannerMutations } from "./banner-mutations";

const Api = (props: PropsWithChildren) => {
    const { children } = pipe(GetAllBanners, BannerMutations)(props);
    return <>{children}</>;
};

export { Api };
