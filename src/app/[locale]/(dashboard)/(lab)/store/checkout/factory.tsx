"use client";

import { StoreCheckoutApiProvider } from "./api";
import { StoreCheckoutObserverProvider } from "./observer";
import { StoreCheckoutStateProvider } from "./state";
import { StoreCheckoutUtilsProvider } from "./utils";
import { StoreCheckoutUIFactory } from "./ui/factory";

export function StoreCheckoutFeatureFactory() {
  return (
    <StoreCheckoutStateProvider>
      <StoreCheckoutApiProvider>
        <StoreCheckoutObserverProvider>
          <StoreCheckoutUtilsProvider>
            <StoreCheckoutUIFactory />
          </StoreCheckoutUtilsProvider>
        </StoreCheckoutObserverProvider>
      </StoreCheckoutApiProvider>
    </StoreCheckoutStateProvider>
  );
}
