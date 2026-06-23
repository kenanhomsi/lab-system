"use client";

import { PropsWithChildren } from "react";
import { GetAllAvailabilities } from "./get-all-availabilities";
import { AvailabilityMutations } from "./availability-mutations";

/**
 * Wires availability queries and mutations into the table store.
 */
const Api = ({ children }: PropsWithChildren) => (
  <GetAllAvailabilities>
    <AvailabilityMutations>{children}</AvailabilityMutations>
  </GetAllAvailabilities>
);

export { Api };
