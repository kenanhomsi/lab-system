"use client";

import { TestsApiProvider } from "./api";
import { TestsObserverProvider } from "./observer";
import { TestsStateProvider } from "./state";
import { TestsUtilsProvider } from "./utils";
import { TestsUIFactory } from "./ui/factory";

export function TestsFeatureFactory() {
  return (
    <TestsStateProvider>
      <TestsApiProvider>
        <TestsObserverProvider>
          <TestsUtilsProvider>
            <TestsUIFactory />
          </TestsUtilsProvider>
        </TestsObserverProvider>
      </TestsApiProvider>
    </TestsStateProvider>
  );
}
