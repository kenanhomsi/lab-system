"use client";

import { PropsWithChildren } from "react";
import { GetAllVacantJobs } from "./get-all-vacant-jobs";
import { VacantJobsMutations } from "./vacant-jobs-mutations";

const Api = (props: PropsWithChildren) => {
  return (
    <GetAllVacantJobs>
      <VacantJobsMutations>{props.children}</VacantJobsMutations>
    </GetAllVacantJobs>
  );
};

export { Api };
