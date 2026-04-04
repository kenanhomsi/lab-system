import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type NewPaymentUiState } from "./state";
import { initialApiState, type NewPaymentApiSliceState } from "./api";
import { initialUtilsState, type NewPaymentUtilsState } from "./utils";

export type NewPaymentStoreState = NewPaymentUiState &
  NewPaymentApiSliceState &
  NewPaymentUtilsState;

export function createInitialNewPaymentState(): NewPaymentStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createNewPaymentStore() {
  return createStoreApi<NewPaymentStoreState>(createInitialNewPaymentState());
}
