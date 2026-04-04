"use client";

import { PriceCalculatorApiProvider } from "./api";
import { PriceCalculatorObserverProvider } from "./observer";
import { PriceCalculatorStateProvider } from "./state";
import { PriceCalculatorUtilsProvider } from "./utils";
import { PriceCalculatorUIFactory } from "./ui/factory";

export function PriceCalculatorFeatureFactory() {
  return (
    <PriceCalculatorStateProvider>
      <PriceCalculatorApiProvider>
        <PriceCalculatorObserverProvider>
          <PriceCalculatorUtilsProvider>
            <PriceCalculatorUIFactory />
          </PriceCalculatorUtilsProvider>
        </PriceCalculatorObserverProvider>
      </PriceCalculatorApiProvider>
    </PriceCalculatorStateProvider>
  );
}
