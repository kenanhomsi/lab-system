"use client";

import { StoreOrdersApiProvider } from "./api";
import { StoreOrdersObserverProvider } from "./observer";
import { StoreOrdersStateProvider } from "./state";
import { StoreOrdersUtilsProvider } from "./utils";
import { StoreOrdersUIFactory } from "./ui/factory";

export function StoreOrdersFeatureFactory() {
  return (
    <StoreOrdersStateProvider>
      <StoreOrdersApiProvider>
        <StoreOrdersObserverProvider>
          <StoreOrdersUtilsProvider>
            <StoreOrdersUIFactory />
          </StoreOrdersUtilsProvider>
        </StoreOrdersObserverProvider>
      </StoreOrdersApiProvider>
    </StoreOrdersStateProvider>
  );
}
