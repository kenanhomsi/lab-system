"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createOrderTrackingStore, type OrderTrackingStoreState } from "./store";

const {
  Provider: OrderTrackingFeatureStoreProvider,
  useStore: useOrderTrackingFeatureStore,
  useStoreApi: useOrderTrackingFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: OrderTrackingExtrasContext,
} = createComponentWithProvider<OrderTrackingStoreState, undefined>(() => createOrderTrackingStore());

export {
  OrderTrackingFeatureStoreProvider,
  useOrderTrackingFeatureStore,
  useOrderTrackingFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  OrderTrackingExtrasContext,
};
