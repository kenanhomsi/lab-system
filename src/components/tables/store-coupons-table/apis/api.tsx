"use client";

import type { PropsWithChildren } from "react";
import { GetCoupons } from "./get-coupons";

const Api = (props: PropsWithChildren) => <GetCoupons>{props.children}</GetCoupons>;

export { Api };
