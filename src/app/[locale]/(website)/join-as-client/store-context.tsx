"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createJoinAsClientStore, type JoinAsClientStoreState } from "./store";

const {
  Provider: JoinAsClientFeatureStoreProvider,
  useStore: useJoinAsClientFeatureStore,
  useStoreApi: useJoinAsClientFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: JoinAsClientExtrasContext,
} = createComponentWithProvider<JoinAsClientStoreState, undefined>(() =>
  createJoinAsClientStore(),
);

export {
  JoinAsClientFeatureStoreProvider,
  useJoinAsClientFeatureStore,
  useJoinAsClientFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  JoinAsClientExtrasContext,
};
