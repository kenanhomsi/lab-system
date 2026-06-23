"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForAppointments } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

/**
 * Composes the blood draw appointments table provider pipeline.
 */
const Factory = () => (
  <State>
    <Observer>
      <Api>
        <Modals />
        <SchemaForAppointments>
          <Utils>
            <UI />
          </Utils>
        </SchemaForAppointments>
      </Api>
    </Observer>
  </State>
);

export { Factory as AppointmentsTable };
