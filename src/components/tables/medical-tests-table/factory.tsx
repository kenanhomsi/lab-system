"use client";

import { Api } from "./apis";
import { Modals } from "./components/modals";
import { Observer } from "./observer";
import { Schema } from "./schema";
import { State } from "./state";
import { Utils } from "./utils";
import { UI } from "./ui";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <Modals />
          <Schema>
            <Utils>
              <UI />
            </Utils>
          </Schema>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as MedicalTestsTable };
