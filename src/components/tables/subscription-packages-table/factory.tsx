"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForSubscriptionPackages } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

const Factory = () => {
  return (
    <State>
      <Observer>
        <Api>
          <Modals />
          <SchemaForSubscriptionPackages>
            <Utils>
              <UI />
            </Utils>
          </SchemaForSubscriptionPackages>
        </Api>
      </Observer>
    </State>
  );
};

export { Factory as SubscriptionPackagesTable };
