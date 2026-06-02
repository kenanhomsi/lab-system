"use client";

import { Api } from "./apis";
import Observer from "./observer";
import { SchemaForClientJoinRequests } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => (
  <State>
    <Observer>
      <Api>
        <SchemaForClientJoinRequests>
          <Utils>
            <UI />
          </Utils>
        </SchemaForClientJoinRequests>
      </Api>
    </Observer>
  </State>
);

export { Factory as ClientJoinRequestsTable };
