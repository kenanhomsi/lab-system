"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import {
  createLabEncyclopediaStore,
  type LabEncyclopediaStoreState,
} from "./store";

const {
  Provider: LabEncyclopediaFeatureStoreProvider,
  useStore: useLabEncyclopediaFeatureStore,
  useStoreApi: useLabEncyclopediaFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: LabEncyclopediaExtrasContext,
} = createComponentWithProvider<LabEncyclopediaStoreState, undefined>(() =>
  createLabEncyclopediaStore(),
);

export {
  LabEncyclopediaFeatureStoreProvider,
  useLabEncyclopediaFeatureStore,
  useLabEncyclopediaFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  LabEncyclopediaExtrasContext,
};
