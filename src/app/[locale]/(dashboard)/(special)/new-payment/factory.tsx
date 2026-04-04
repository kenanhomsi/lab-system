"use client";

import { NewPaymentApiProvider } from "./api";
import { NewPaymentObserverProvider } from "./observer";
import { NewPaymentStateProvider } from "./state";
import { NewPaymentUtilsProvider } from "./utils";
import { NewPaymentUIFactory } from "./ui/factory";

export function NewPaymentFeatureFactory() {
  return (
    <NewPaymentStateProvider>
      <NewPaymentApiProvider>
        <NewPaymentObserverProvider>
          <NewPaymentUtilsProvider>
            <NewPaymentUIFactory />
          </NewPaymentUtilsProvider>
        </NewPaymentObserverProvider>
      </NewPaymentApiProvider>
    </NewPaymentStateProvider>
  );
}
