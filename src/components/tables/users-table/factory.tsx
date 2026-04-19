"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import { SchemaForUsers } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";
import Observer from "./observer";
const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <Modals />
          <SchemaForUsers>
            <Utils>
              <UI />
            </Utils>
          </SchemaForUsers>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as UsersTable };
