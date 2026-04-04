"use client";

import { RequestTestsApiProvider } from "./api";
import { RequestTestsObserverProvider } from "./observer";
import { RequestTestsStateProvider } from "./state";
import { RequestTestsUtilsProvider } from "./utils";
import { RequestTestsUIFactory } from "./ui/factory";

export function RequestTestsFeatureFactory() {
  return (
    <RequestTestsStateProvider>
      <RequestTestsApiProvider>
        <RequestTestsObserverProvider>
          <RequestTestsUtilsProvider>
            <RequestTestsUIFactory />
          </RequestTestsUtilsProvider>
        </RequestTestsObserverProvider>
      </RequestTestsApiProvider>
    </RequestTestsStateProvider>
  );
}
