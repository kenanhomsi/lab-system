"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForAccessPolicies } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <Modals />
          <SchemaForAccessPolicies>
            <Utils>
              <UI />
            </Utils>
          </SchemaForAccessPolicies>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as AccessPoliciesTable };
