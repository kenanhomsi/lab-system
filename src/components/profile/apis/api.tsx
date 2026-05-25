"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetMe } from "./get-me";
import { Mutations } from "./mutations";

const Api = (props: PropsWithChildren) => pipe(GetMe, Mutations)(props);

export { Api };

