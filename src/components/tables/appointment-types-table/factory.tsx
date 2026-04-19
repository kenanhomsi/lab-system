"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForAppointmentTypes } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <Modals />
          <SchemaForAppointmentTypes>
            <Utils>
              <UI />
            </Utils>
          </SchemaForAppointmentTypes>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as AppointmentTypesTable };
