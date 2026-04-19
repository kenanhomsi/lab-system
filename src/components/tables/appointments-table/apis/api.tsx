"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { AppointmentsMutations } from "./appointments-mutations";
import { GetAllAppointments } from "./get-all-appointments";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllAppointments, AppointmentsMutations)(props);
  return <>{children}</>;
};

export { Api };
