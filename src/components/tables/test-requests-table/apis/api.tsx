"use client";

import { PropsWithChildren } from "react";
import { GetAllTestRequests } from "./get-all-test-requests";
import { TestRequestsMutations } from "./test-requests-mutations";

const Api = (props: PropsWithChildren) => {
  return (
    <GetAllTestRequests>
      <TestRequestsMutations>{props.children}</TestRequestsMutations>
    </GetAllTestRequests>
  );
};

export { Api };
