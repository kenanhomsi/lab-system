"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllUsers } from "./get-all-users";
import { UsersMutations } from "./users-mutations";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllUsers, UsersMutations)(props);
  return <>{children}</>;
};

export { Api };
