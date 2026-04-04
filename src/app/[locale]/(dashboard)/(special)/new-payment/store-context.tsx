"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createNewPaymentStore, type NewPaymentStoreState } from "./store";

const {
  Provider: NewPaymentFeatureStoreProvider,
  useStore: useNewPaymentFeatureStore,
  useStoreApi: useNewPaymentFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: NewPaymentExtrasContext,
} = createComponentWithProvider<NewPaymentStoreState, undefined>(() => createNewPaymentStore());

export {
  NewPaymentFeatureStoreProvider,
  useNewPaymentFeatureStore,
  useNewPaymentFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  NewPaymentExtrasContext,
};
