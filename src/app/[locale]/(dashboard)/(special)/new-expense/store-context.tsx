"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createNewExpenseStore, type NewExpenseStoreState } from "./store";

const {
  Provider: NewExpenseFeatureStoreProvider,
  useStore: useNewExpenseFeatureStore,
  useStoreApi: useNewExpenseFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: NewExpenseExtrasContext,
} = createComponentWithProvider<NewExpenseStoreState, undefined>(() => createNewExpenseStore());

export {
  NewExpenseFeatureStoreProvider,
  useNewExpenseFeatureStore,
  useNewExpenseFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  NewExpenseExtrasContext,
};
