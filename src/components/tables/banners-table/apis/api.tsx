"use client";

import { PropsWithChildren } from "react";
import { GetAllBanners } from "./get-all-banners";
import { BannerMutations } from "./banner-mutations";

const Api = ({ children }: PropsWithChildren) => (
  <GetAllBanners>
    <BannerMutations>{children}</BannerMutations>
  </GetAllBanners>
);

export { Api };
