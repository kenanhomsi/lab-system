"use client";

import type { PropsWithChildren } from "react";
import { GetProducts } from "./get-products";
import { GetSliders } from "./get-sliders";

const Api = (props: PropsWithChildren) => (
  <GetSliders>
    <GetProducts>{props.children}</GetProducts>
  </GetSliders>
);

export { Api };
