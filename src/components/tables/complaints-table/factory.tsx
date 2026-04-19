"use client";

import { Api } from "./apis";
import { SchemaForComplaints } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";
import Observer from "./observer";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <SchemaForComplaints>
            <Utils>
              <UI />
            </Utils>
          </SchemaForComplaints>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as ComplaintsTable };
