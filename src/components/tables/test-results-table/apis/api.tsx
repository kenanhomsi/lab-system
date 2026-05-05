"use client";

import { PropsWithChildren } from "react";
import { GetAllTestResults } from "./get-all-test-results";
import { TestResultsMutations } from "./test-results-mutations";

const Api = (props: PropsWithChildren) => {
  return (
    <GetAllTestResults>
      <TestResultsMutations>{props.children}</TestResultsMutations>
    </GetAllTestResults>
  );
};

export { Api };
