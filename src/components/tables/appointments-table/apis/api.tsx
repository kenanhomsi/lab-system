"use client";

import { PropsWithChildren } from "react";
import { GetAllAppointments } from "./get-all-appointments";
import { AppointmentMutations } from "./appointment-mutations";

/**
 * Wires appointment queries and mutations into the table store.
 */
const Api = ({ children }: PropsWithChildren) => (
  <GetAllAppointments>
    <AppointmentMutations>{children}</AppointmentMutations>
  </GetAllAppointments>
);

export { Api };
