"use client";

import { PropsWithChildren } from "react";
import { GetAllMedicalTests } from "./get-all-medical-tests";
import { MedicalTestsMutations } from "./medical-tests-mutations";

const Api = (props: PropsWithChildren) => {
  return (
    <GetAllMedicalTests>
      <MedicalTestsMutations>{props.children}</MedicalTestsMutations>
    </GetAllMedicalTests>
  );
};

export { Api };
