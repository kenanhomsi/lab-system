import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type StorefrontUiState } from "./state";
import { initialApiState, type StorefrontApiSliceState } from "./api";
import { initialUtilsState, type StorefrontUtilsState } from "./utils";

export type StorefrontStoreState = StorefrontUiState &
  StorefrontApiSliceState &
  StorefrontUtilsState;

export function createInitialStorefrontState(): StorefrontStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createStorefrontStore() {
  return createStoreApi<StorefrontStoreState>(createInitialStorefrontState());
}
