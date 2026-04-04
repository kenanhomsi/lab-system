"use client";

import { MyResultsApiProvider } from "./api";
import { MyResultsObserverProvider } from "./observer";
import { MyResultsStateProvider } from "./state";
import { MyResultsUtilsProvider } from "./utils";
import { MyResultsUIFactory } from "./ui/factory";

export function MyResultsFeatureFactory() {
  return (
    <MyResultsStateProvider>
      <MyResultsApiProvider>
        <MyResultsObserverProvider>
          <MyResultsUtilsProvider>
            <MyResultsUIFactory />
          </MyResultsUtilsProvider>
        </MyResultsObserverProvider>
      </MyResultsApiProvider>
    </MyResultsStateProvider>
  );
}
