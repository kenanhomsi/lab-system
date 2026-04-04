import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type ContactUsUiState } from "./state";
import { initialApiState, type ContactUsApiSliceState } from "./api";
import { initialUtilsState, type ContactUsUtilsState } from "./utils";

export type ContactUsStoreState = ContactUsUiState &
  ContactUsApiSliceState &
  ContactUsUtilsState;

export function createInitialContactUsState(): ContactUsStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createContactUsStore() {
  return createStoreApi<ContactUsStoreState>(createInitialContactUsState());
}
