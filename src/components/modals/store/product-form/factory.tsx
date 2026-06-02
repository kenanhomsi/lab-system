"use client";

import { Api } from "./api";
import { Init } from "./init";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";
import type { FactoryProps } from "./types";

const Factory = (props: FactoryProps) => (
  <Init {...props}>
    <State>
      <Api>
        <Utils>
          <UI />
        </Utils>
      </Api>
    </State>
  </Init>
);

export { Factory };
