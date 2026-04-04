"use client";

import { InsuranceRequestApiProvider } from "./api";
import { InsuranceRequestObserverProvider } from "./observer";
import { InsuranceRequestStateProvider } from "./state";
import { InsuranceRequestUtilsProvider } from "./utils";
import { InsuranceRequestUIFactory } from "./ui/factory";

export function InsuranceRequestFeatureFactory() {
  return (
    <InsuranceRequestStateProvider>
      <InsuranceRequestApiProvider>
        <InsuranceRequestObserverProvider>
          <InsuranceRequestUtilsProvider>
            <InsuranceRequestUIFactory />
          </InsuranceRequestUtilsProvider>
        </InsuranceRequestObserverProvider>
      </InsuranceRequestApiProvider>
    </InsuranceRequestStateProvider>
  );
}
