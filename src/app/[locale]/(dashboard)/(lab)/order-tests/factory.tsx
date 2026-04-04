"use client";

import { OrderTestsApiProvider } from "./api";
import { OrderTestsObserverProvider } from "./observer";
import { OrderTestsStateProvider } from "./state";
import { OrderTestsUtilsProvider } from "./utils";
import { OrderTestsUIFactory } from "./ui/factory";

export function OrderTestsFeatureFactory() {
  return (
    <OrderTestsStateProvider>
      <OrderTestsApiProvider>
        <OrderTestsObserverProvider>
          <OrderTestsUtilsProvider>
            <OrderTestsUIFactory />
          </OrderTestsUtilsProvider>
        </OrderTestsObserverProvider>
      </OrderTestsApiProvider>
    </OrderTestsStateProvider>
  );
}
