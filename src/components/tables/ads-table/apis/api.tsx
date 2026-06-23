"use client";

import { PropsWithChildren } from "react";
import { GetAllAds } from "./get-all-ads";
import { AdMutations } from "./ad-mutations";

/**
 * Wires ads queries and mutations into the table store.
 */
const Api = ({ children }: PropsWithChildren) => (
  <GetAllAds>
    <AdMutations>{children}</AdMutations>
  </GetAllAds>
);

export { Api };
