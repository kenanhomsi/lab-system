"use client";

import { Init } from "./init";
import { State } from "./state";
import { UI } from "./ui";
import { FactoryProps } from "./types";

const Factory = (props: FactoryProps) => {
  return (
    <Init {...props}>
      <State key={props.user?.id ?? "empty"}>
        <UI />
      </State>
    </Init>
  );
};

export { Factory };
