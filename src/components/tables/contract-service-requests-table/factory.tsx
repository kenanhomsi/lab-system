"use client";

import { Api } from "./apis";
import Observer from "./observer";
import { SchemaForContractServiceRequests } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => (
  <State>
    <Observer>
      <Api>
        <SchemaForContractServiceRequests>
          <Utils>
            <UI />
          </Utils>
        </SchemaForContractServiceRequests>
      </Api>
    </Observer>
  </State>
);

export { Factory as ContractServiceRequestsTable };
