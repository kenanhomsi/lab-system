"use client";

import { Api } from "./apis/api";
import { Schema } from "./schema/schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils/utils";

const Factory = () => (
  <State>
    <Api>
      <Schema>
        <Utils>
          <UI />
        </Utils>
      </Schema>
    </Api>
  </State>
);

export { Factory as StoreOrdersTable };
