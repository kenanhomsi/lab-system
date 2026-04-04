"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import {
  createOffersStore,
  type OffersPageExtras,
  type OffersStoreState,
} from "./store";

const {
  Provider: OffersFeatureStoreProvider,
  useStore: useOffersFeatureStore,
  useStoreApi: useOffersFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: OffersExtrasContext,
} = createComponentWithProvider<OffersStoreState, OffersPageExtras>(
  (extras) => createOffersStore(extras),
);

export {
  OffersFeatureStoreProvider,
  useOffersFeatureStore,
  useOffersFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  OffersExtrasContext,
};
