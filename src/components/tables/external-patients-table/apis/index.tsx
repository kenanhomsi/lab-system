"use client";

import { PropsWithChildren } from "react";
import { ExternalPatientsMutations } from "./external-patients-mutations";
import { GetAllExternalPatients } from "./get-all-external-patients";

const Api = (props: PropsWithChildren) => {
  return (
    <GetAllExternalPatients>
      <ExternalPatientsMutations>{props.children}</ExternalPatientsMutations>
    </GetAllExternalPatients>
  );
};

export { Api };
