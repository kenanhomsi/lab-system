"use client";

import { StoreCartApiProvider } from "./api";
import { StoreCartObserverProvider } from "./observer";
import { StoreCartStateProvider } from "./state";
import { StoreCartUtilsProvider } from "./utils";
import { StoreCartUIFactory } from "./ui/factory";

export function StoreCartFeatureFactory() {
  return (
    <StoreCartStateProvider>
      <StoreCartApiProvider>
        <StoreCartObserverProvider>
          <StoreCartUtilsProvider>
            <StoreCartUIFactory />
          </StoreCartUtilsProvider>
        </StoreCartObserverProvider>
      </StoreCartApiProvider>
    </StoreCartStateProvider>
  );
}
