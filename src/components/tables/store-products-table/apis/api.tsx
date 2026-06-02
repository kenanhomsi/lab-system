"use client";

import type { PropsWithChildren } from "react";
import { GetCategories } from "./get-categories";
import { GetProducts } from "./get-products";

const Api = (props: PropsWithChildren) => (
  <GetProducts>
    <GetCategories>{props.children}</GetCategories>
  </GetProducts>
);

export { Api };
