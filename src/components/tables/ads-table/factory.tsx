"use client";

import { Api } from "./apis";
import { Modals } from "./components";
import Observer from "./observer";
import { SchemaForAds } from "./schema";
import { State } from "./state";
import { UI } from "./ui";
import { Utils } from "./utils";

/**
 * Composes the ads table provider pipeline.
 */
const Factory = () => (
  <State>
    <Observer>
      <Api>
        <Modals />
        <SchemaForAds>
          <Utils>
            <UI />
          </Utils>
        </SchemaForAds>
      </Api>
    </Observer>
  </State>
);

export { Factory as AdsTable };
