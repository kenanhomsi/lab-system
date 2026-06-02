"use client";

import type { PropsWithChildren } from "react";
import { GetCategories } from "./get-categories";

const Api = (props: PropsWithChildren) => <GetCategories>{props.children}</GetCategories>;

export { Api };
