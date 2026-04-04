"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createStoreCartStore, type StoreCartStoreState } from "./store";

const {
  Provider: StoreCartFeatureStoreProvider,
  useStore: useStoreCartFeatureStore,
  useStoreApi: useStoreCartFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: StoreCartExtrasContext,
} = createComponentWithProvider<StoreCartStoreState, undefined>(() =>
  createStoreCartStore(),
);

export {
  StoreCartFeatureStoreProvider,
  useStoreCartFeatureStore,
  useStoreCartFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  StoreCartExtrasContext,
};
