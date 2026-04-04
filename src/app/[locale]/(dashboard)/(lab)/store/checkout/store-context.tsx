"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createStoreCheckoutStore, type StoreCheckoutStoreState } from "./store";

const {
  Provider: StoreCheckoutFeatureStoreProvider,
  useStore: useStoreCheckoutFeatureStore,
  useStoreApi: useStoreCheckoutFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: StoreCheckoutExtrasContext,
} = createComponentWithProvider<StoreCheckoutStoreState, undefined>(() =>
  createStoreCheckoutStore(),
);

export {
  StoreCheckoutFeatureStoreProvider,
  useStoreCheckoutFeatureStore,
  useStoreCheckoutFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  StoreCheckoutExtrasContext,
};
