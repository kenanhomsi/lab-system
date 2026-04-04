"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createStoreOrdersStore, type StoreOrdersStoreState } from "./store";

const {
  Provider: StoreOrdersFeatureStoreProvider,
  useStore: useStoreOrdersFeatureStore,
  useStoreApi: useStoreOrdersFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: StoreOrdersExtrasContext,
} = createComponentWithProvider<StoreOrdersStoreState, undefined>(() =>
  createStoreOrdersStore(),
);

export {
  StoreOrdersFeatureStoreProvider,
  useStoreOrdersFeatureStore,
  useStoreOrdersFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  StoreOrdersExtrasContext,
};
