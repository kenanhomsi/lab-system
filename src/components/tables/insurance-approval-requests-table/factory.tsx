"use client";

import { Api } from "./apis";
import Observer from "./observer";
import { SchemaForInsuranceApproval } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => (
  <State>
    <Observer>
      <Api>
        <SchemaForInsuranceApproval>
          <Utils>
            <UI />
          </Utils>
        </SchemaForInsuranceApproval>
      </Api>
    </Observer>
  </State>
);

export { Factory as InsuranceApprovalRequestsTable };
