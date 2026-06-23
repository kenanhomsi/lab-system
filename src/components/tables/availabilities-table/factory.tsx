"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForAvailabilities } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

/**
 * Composes the availabilities table provider pipeline.
 */
const Factory = () => (
  <State>
    <Observer>
      <Api>
        <Modals />
        <SchemaForAvailabilities>
          <Utils>
            <UI />
          </Utils>
        </SchemaForAvailabilities>
      </Api>
    </Observer>
  </State>
);

export { Factory as AvailabilitiesTable };
