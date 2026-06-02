"use client";

import { Api } from "./apis/api";
import { Modals } from "./components/modals";
import { Schema } from "./schema/schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils/utils";

const Factory = () => (
  <State>
    <Api>
      <Modals />
      <Schema>
        <Utils>
          <UI />
        </Utils>
      </Schema>
    </Api>
  </State>
);

export { Factory as StoreBannersTable };
