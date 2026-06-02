"use client";

import type { PropsWithChildren } from "react";
import { GetBanners } from "./get-banners";

const Api = (props: PropsWithChildren) => <GetBanners>{props.children}</GetBanners>;

export { Api };
