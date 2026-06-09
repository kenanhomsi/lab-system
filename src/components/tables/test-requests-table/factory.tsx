"use client";

import { Api } from "./apis";
import { Modals } from "./components/modals";
import { Init } from "./init";
import { Observer } from "./observer";
import { Schema } from "./schema";
import { State } from "./state";
import { Utils } from "./utils";
import { UI } from "./ui";

type TestRequestsTableProps = {
  initialActiveModal?: "create" | null;
};

const Factory = ({ initialActiveModal = null }: TestRequestsTableProps) => {
  return (
    <Init>
      <State initialActiveModal={initialActiveModal}>
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
    </Init>
  );
};

export { Factory as TestRequestsTable };
