"use client";

import { PropsWithChildren } from "react";
import { GetOrders } from "./get-orders";
import { Mutations } from "./mutations";

const Api = (props: PropsWithChildren) => (
  <GetOrders>
    <Mutations>{props.children}</Mutations>
  </GetOrders>
);

export { Api };
