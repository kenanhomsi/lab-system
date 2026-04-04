"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createContactUsStore, type ContactUsStoreState } from "./store";

const {
  Provider: ContactUsFeatureStoreProvider,
  useStore: useContactUsFeatureStore,
  useStoreApi: useContactUsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: ContactUsExtrasContext,
} = createComponentWithProvider<ContactUsStoreState, undefined>(() =>
  createContactUsStore(),
);

export {
  ContactUsFeatureStoreProvider,
  useContactUsFeatureStore,
  useContactUsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ContactUsExtrasContext,
};
