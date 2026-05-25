"use client";

import { Api } from "./apis";
import Observer from "./observer";
import { SchemaForMyComplaints } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <SchemaForMyComplaints>
            <Utils>
              <UI />
            </Utils>
          </SchemaForMyComplaints>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as MyComplaintsTable };
