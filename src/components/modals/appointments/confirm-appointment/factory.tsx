"use client";

import { Api } from "./api";
import { Init } from "./init";
import { State } from "./state";
import { FactoryProps } from "./types";
import { UI } from "./ui";

const Factory = (props: FactoryProps) => {
  return (
    <Init {...props}>
      <State>
        <Api>
          <UI />
        </Api>
      </State>
    </Init>
  );
};

export { Factory };
