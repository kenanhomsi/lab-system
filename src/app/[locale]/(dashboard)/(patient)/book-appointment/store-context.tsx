"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createBookAppointmentStore, type BookAppointmentStoreState } from "./store";

const {
  Provider: BookAppointmentFeatureStoreProvider,
  useStore: useBookAppointmentFeatureStore,
  useStoreApi: useBookAppointmentFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: BookAppointmentExtrasContext,
} = createComponentWithProvider<BookAppointmentStoreState, undefined>(() =>
  createBookAppointmentStore(),
);

export {
  BookAppointmentFeatureStoreProvider,
  useBookAppointmentFeatureStore,
  useBookAppointmentFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  BookAppointmentExtrasContext,
};
