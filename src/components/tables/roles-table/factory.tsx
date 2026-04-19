"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForRoles } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <Modals />
          <SchemaForRoles>
            <Utils>
              <UI />
            </Utils>
          </SchemaForRoles>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as RolesTable };
