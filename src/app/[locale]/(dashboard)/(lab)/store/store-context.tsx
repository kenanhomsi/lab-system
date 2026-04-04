"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createStorefrontStore, type StorefrontStoreState } from "./store";

const {
  Provider: StorefrontFeatureStoreProvider,
  useStore: useStorefrontFeatureStore,
  useStoreApi: useStorefrontFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: StorefrontExtrasContext,
} = createComponentWithProvider<StorefrontStoreState, undefined>(() =>
  createStorefrontStore(),
);

export {
  StorefrontFeatureStoreProvider,
  useStorefrontFeatureStore,
  useStorefrontFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  StorefrontExtrasContext,
};
