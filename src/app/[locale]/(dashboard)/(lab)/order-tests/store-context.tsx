"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createOrderTestsStore, type OrderTestsStoreState } from "./store";

const {
  Provider: OrderTestsFeatureStoreProvider,
  useStore: useOrderTestsFeatureStore,
  useStoreApi: useOrderTestsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: OrderTestsExtrasContext,
} = createComponentWithProvider<OrderTestsStoreState, undefined>(() =>
  createOrderTestsStore(),
);

export {
  OrderTestsFeatureStoreProvider,
  useOrderTestsFeatureStore,
  useOrderTestsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  OrderTestsExtrasContext,
};
