"use client";

import { Api } from "./apis";
import Observer from "./observer";
import { SchemaForMyInsuranceApproval } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => (
  <State>
    <Observer>
      <Api>
        <SchemaForMyInsuranceApproval>
          <Utils>
            <UI />
          </Utils>
        </SchemaForMyInsuranceApproval>
      </Api>
    </Observer>
  </State>
);

export { Factory as MyInsuranceApprovalRequestsTable };
