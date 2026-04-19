"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { AppointmentTypeMutations } from "./appointment-type-mutations";
import { GetAllAppointmentTypes } from "./get-all-appointment-types";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllAppointmentTypes, AppointmentTypeMutations)(props);
  return <>{children}</>;
};

export { Api };
