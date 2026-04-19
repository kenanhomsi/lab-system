"use client";

import { Api } from "./api";
import { Init } from "./init";
import { Observer } from "./observer";
import { State } from "./state";
import { Utils } from "./utils";
import { UI } from "./ui";
import { FactoryProps } from "./types";

const Factory = (props: FactoryProps) => {
  return (
    <Init {...props}>
      <State>
        <Api>
          <Observer>
            <Utils>
              <UI />
            </Utils>
          </Observer>
        </Api>
      </State>
    </Init>
  );
};

export { Factory };
