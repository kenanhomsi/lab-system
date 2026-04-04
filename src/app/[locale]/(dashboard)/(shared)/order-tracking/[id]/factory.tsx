"use client";

import { OrderTrackingApiProvider } from "./api";
import { OrderTrackingObserverProvider } from "./observer";
import { OrderTrackingStateProvider } from "./state";
import { OrderTrackingUtilsProvider } from "./utils";
import { OrderTrackingUIFactory } from "./ui/factory";

export function OrderTrackingFeatureFactory() {
  return (
    <OrderTrackingStateProvider>
      <OrderTrackingApiProvider>
        <OrderTrackingObserverProvider>
          <OrderTrackingUtilsProvider>
            <OrderTrackingUIFactory />
          </OrderTrackingUtilsProvider>
        </OrderTrackingObserverProvider>
      </OrderTrackingApiProvider>
    </OrderTrackingStateProvider>
  );
}
