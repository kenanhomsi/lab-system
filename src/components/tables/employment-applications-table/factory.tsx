"use client";

import { Api } from "./apis";
import Observer from "./observer";
import { SchemaForEmploymentApplications } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <SchemaForEmploymentApplications>
            <Utils>
              <UI />
            </Utils>
          </SchemaForEmploymentApplications>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as EmploymentApplicationsTable };