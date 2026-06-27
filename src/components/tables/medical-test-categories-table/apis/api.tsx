"use client";

import { PropsWithChildren } from "react";
import { GetCategories } from "./get-categories";
import { Mutations } from "./mutations";

const Api = ({ children }: PropsWithChildren) => (
  <GetCategories>
    <Mutations>{children}</Mutations>
  </GetCategories>
);

export { Api };
