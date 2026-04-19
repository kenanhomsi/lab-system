"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForPermissions } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <Modals />
          <SchemaForPermissions>
            <Utils>
              <UI />
            </Utils>
          </SchemaForPermissions>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as PermissionsTable };
