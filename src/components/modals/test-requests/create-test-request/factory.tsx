"use client";
import { Api } from "./api";
import { Init } from "./init";
import { State } from "./state";
import { CreateTestRequestForm } from "./create-test-request-form";
import { FactoryProps } from "./types";
const Factory = (props: FactoryProps) => (
  <Init {...props}>
    <State>
      <Api>
        <CreateTestRequestForm />
      </Api>
    </State>
  </Init>
);
export { Factory };
